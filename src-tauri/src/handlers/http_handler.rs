//! Handles the HTTP server for the overlays
use std::{
    fs,
    io::{BufReader, prelude::*},
    net::{TcpListener, TcpStream},
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc, LazyLock, Mutex,
    },
    thread::{self},
    time::Duration,
};

use once_cell::sync::OnceCell;

use crate::{constants::get_code_dir, thread_data::{thread_data_setup, ThreadData}};

static THREAD_DATA: OnceCell<Arc<Mutex<ThreadData>>> = OnceCell::new();

static SERVER_RUNNING: LazyLock<Arc<Mutex<bool>>> = LazyLock::new(|| Arc::new(Mutex::new(false)));

/// Maximum number of connections served at the same time
const MAX_CONNECTIONS: usize = 32;

/// Maximum size of the request line in bytes
const MAX_REQUEST_LINE: u64 = 8192;

/// How long a client may stall on a read or write before it's dropped
const IO_TIMEOUT: Duration = Duration::from_secs(5);

static ACTIVE_CONNECTIONS: AtomicUsize = AtomicUsize::new(0);

/// Decrements `ACTIVE_CONNECTIONS` when dropped, even if the handler panics
struct ConnectionGuard;

impl Drop for ConnectionGuard {
    fn drop(&mut self) {
        ACTIVE_CONNECTIONS.fetch_sub(1, Ordering::SeqCst);
    }
}

/// Sets the `THREAD_DATA` variable to a new `ThreadData` struct
pub fn setup() {
    THREAD_DATA.set(thread_data_setup()).unwrap();
}

/// Starts a thread for the HTTP server called `http_server`
/// 
/// # Returns
/// * `Ok(String)` - Message to be pushed to the frontend on success
/// * `Err(String` - Message to pushed to the frontend on error
#[tauri::command]
pub fn run_server() -> Result<String, String> {
    // Gets the THREAD_DATA struct
    let thread_data: &Arc<Mutex<ThreadData>> =
        THREAD_DATA.get().expect("Unable to get thread_data");

    // Binds a port for the server
    let listener = TcpListener::bind("127.0.0.1:8080");

    match SERVER_RUNNING.try_lock() {
        Ok(v) => {
            if *v {
                println!("Server is already running");
                return Ok("Server is already running".to_string());
            } 
        }
        Err(e) => {
            eprintln!("Failed to acquire lock on SERVER_RUNNING: {e}");
            return Err("Failed to start the server: Unable to acquire lock".to_string());
        }
    };

    // If the listen doesn't error, build a new thread to listen for incoming traffic
    if listener.is_ok() {
        let _ = thread::Builder::new()
            .name("http_server_thread".to_string())
            .spawn(move || ThreadData::handle_connection(listener.unwrap(), thread_data.clone()));

        match SERVER_RUNNING.try_lock() {
            Ok(mut v) => {
                println!("Server Started");
                *v = true;
            }
            Err(e) => {
                eprintln!("Failed to acquire lock on SERVER_RUNNING: {e}");
                return Err("Failed to start the server: Unable to acquire lock".to_string());
            } 
        };
        Ok("Server Started".to_string())
    } else {
        match SERVER_RUNNING.try_lock() {
            Ok(mut v) => {
                println!("Server Failed to Start");
                *v = false;
            }
            Err(e) => {
                eprintln!("Failed to acquire lock on SERVER_RUNNING: {e}");
            }
        }
        Err(format!("Error Starting Server: {}", listener.unwrap_err()))
    }
}

/// Stops the `http_server` thread by getting the `THREAD_DATA`
/// 
/// It will update the value on the shared `struct`
/// 
/// Then it will connect to the server and write `SHUTDOWN` to it
/// 
/// The message content doesn't matter but I figured I'd make it logical
/// 
/// # Returns
/// * `Ok(String)` - Message to be pushed to the frontend on success
/// * `Err(String)` - Message to be pushed to the frontend on error
#[tauri::command]
pub fn stop_server() -> Result<String, String> {
    if let Some(thread_data) = THREAD_DATA.get() {
        let mut data = thread_data.lock().unwrap();
        data.set_stop(true);
        drop(data); // Explicitly drop the lock before connecting to the server

        // Connects to the server and writes it so that it reads the stop variable
        let stream = TcpStream::connect("127.0.0.1:8080");

        match stream {
            Ok(mut stream) => {
                stream.write("SHUTDOWN".as_bytes()).unwrap();

                match SERVER_RUNNING.try_lock() {
                    Ok(mut v) => {
                        println!("Server Stopped");
                        *v = false;
                    }
                    Err(e) => {
                        eprintln!("Failed to acquire lock on SERVER_RUNNING: {e}");
                    }
                };

                Ok("Server Stopped".to_string())
            }
            Err(error) => Err(format!("Has the server been started? {}", error)),
        }
    } else {
        Err("Failed to stop the server: THREAD_DATA not initialized".to_string())
    }
}

#[tauri::command]
pub fn is_server_running() -> bool {
    match SERVER_RUNNING.try_lock() {
        Ok(v) => *v,
        Err(e) => {
            eprintln!("Failed to acquire lock on SERVER_RUNNING: {e}");
            false
        }
    }
}

impl ThreadData {
/// Handles the incoming server traffic to either send it to the request processor or exit this cycle of the loop
/// 
/// # Parameters
/// * `listener: TcpListener` - listener from binding the TCP address & port
/// * `thread_data: Arc<Mutex<Self>>` - The variable storing the shared data
    fn handle_connection(listener: TcpListener, thread_data: Arc<Mutex<Self>>) {
        for stream in listener.incoming() {
            // If the stop variable is true stop the thread
            if thread_data.lock().unwrap().get_stop() {
                // Set the stop variable to false so the server can be started again
                Self::set_stop(&mut *thread_data.lock().unwrap(), false);
                break;
            }

            // If the incoming traffic is valid then process it, otherwise print an error and continue to the next loop
            match stream {
                Ok(stream) => {
                    if ACTIVE_CONNECTIONS.fetch_add(1, Ordering::SeqCst) >= MAX_CONNECTIONS {
                        ACTIVE_CONNECTIONS.fetch_sub(1, Ordering::SeqCst);
                        continue;
                    }

                    // Handled on its own thread so one slow client can't block the others
                    let spawned = thread::Builder::new()
                        .name("http_request_thread".to_string())
                        .spawn(move || {
                            let _guard = ConnectionGuard;
                            process_request(stream);
                        });

                    if let Err(e) = spawned {
                        ACTIVE_CONNECTIONS.fetch_sub(1, Ordering::SeqCst);
                        eprintln!("Failed to spawn request thread: {e}");
                    }
                }
                Err(e) => {
                    eprintln!("Failed to handle the connection: {e}");
                    continue;
                }
            }
        }
    }
}

/// * Gives the client the request data as bytes
/// * It will take care of any errors with the incoming request being invalid or if the client disconnects mid request
/// * Only serves files that resolve to a location inside the code directory
/// * Drops clients that stall for longer than `IO_TIMEOUT`
/// # Parameters
/// * `mut stream: TcpSteam` - The incoming stream of data requested by the client 
fn process_request(mut stream: TcpStream) {
    let _ = stream.set_read_timeout(Some(IO_TIMEOUT));
    let _ = stream.set_write_timeout(Some(IO_TIMEOUT));

    let mut request_line = String::new();

    // Reads only the request line, capped so a client can't send unbounded data
    match BufReader::new((&stream).take(MAX_REQUEST_LINE)).read_line(&mut request_line) {
        Ok(n) if n > 0 => (),
        _ => return,
    }

    let mut parts = request_line.split_whitespace();
    let method = parts.next().unwrap_or_default();
    let target = parts.next().unwrap_or_default();

    let (status_line, contents) = if method != "GET" {
        (
            "HTTP/1.1 405 METHOD NOT ALLOWED",
            "<h1>405 Method Not Allowed</h1>".as_bytes().to_vec(),
        )
    } else {
        match resolve_request_path(target).and_then(|path| fs::read(path).ok()) {
            Some(bytes) => ("HTTP/1.1 200 OK", bytes),
            None => (
                "HTTP/1.1 404 NOT FOUND",
                "<h1>404 Not Found</h1>".as_bytes().to_vec(),
            ),
        }
    };

    let length = contents.len();

    // Format the data and write the header, a failed write means the client left
    let header = format!("{status_line}\r\nContent-Length: {length}\r\n\r\n");
    if stream.write_all(header.as_bytes()).is_ok() {
        let _ = stream.write_all(&contents);
    }
}

/// Maps a request target to a file inside the code directory
///
/// # Returns
/// * `Some(PathBuf)` - Canonical path to an existing file inside the code directory
/// * `None` - If the target is malformed, escapes the code directory, or doesn't exist
fn resolve_request_path(target: &str) -> Option<PathBuf> {
    // Drops the query string and fragment
    let raw = target.split(['?', '#']).next()?;
    let decoded = percent_decode(raw)?;

    let root = Path::new(&get_code_dir()).canonicalize().ok()?;
    let mut path = root.clone();

    // Empty segments cover the leading and any duplicate '/'
    for segment in decoded.split(['/', '\\']) {
        match segment {
            "" | "." => continue,
            ".." => return None,
            s if s.contains([':', '\0']) => return None,
            s => path.push(s),
        }
    }

    if path == root {
        path.push("index.html");
    }

    // Canonicalizing resolves symlinks so they can't point outside the root
    let canonical = path.canonicalize().ok()?;

    if canonical.starts_with(&root) && canonical.is_file() {
        Some(canonical)
    } else {
        None
    }
}

/// Decodes `%XX` sequences in a request path
fn percent_decode(input: &str) -> Option<String> {
    let bytes = input.as_bytes();
    let mut out: Vec<u8> = Vec::with_capacity(bytes.len());
    let mut i = 0;

    while i < bytes.len() {
        if bytes[i] == b'%' {
            let hex = std::str::from_utf8(bytes.get(i + 1..i + 3)?).ok()?;
            out.push(u8::from_str_radix(hex, 16).ok()?);
            i += 3;
        } else {
            out.push(bytes[i]);
            i += 1;
        }
    }

    String::from_utf8(out).ok()
}
