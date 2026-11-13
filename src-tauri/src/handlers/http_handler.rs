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
    time::{Duration, Instant},
};

use once_cell::sync::OnceCell;
use serde_json::Value;

use crate::{constants::{get_code_dir, get_overlay_json_path}, thread_data::{thread_data_setup, ThreadData}};

static THREAD_DATA: OnceCell<Arc<Mutex<ThreadData>>> = OnceCell::new();

static SERVER_RUNNING: LazyLock<Arc<Mutex<bool>>> = LazyLock::new(|| Arc::new(Mutex::new(false)));

/// Maximum number of connections served at the same time, event streams hold one each
const MAX_CONNECTIONS: usize = 64;

/// Maximum size of the request line and headers in bytes
const MAX_REQUEST_LINE: u64 = 16384;

/// How long a client may stall on a read or write before it's dropped
const IO_TIMEOUT: Duration = Duration::from_secs(5);

static ACTIVE_CONNECTIONS: AtomicUsize = AtomicUsize::new(0);

/// Changes every time the server stops, so event streams from the old run know to end
static SERVER_GENERATION: AtomicUsize = AtomicUsize::new(0);

/// How often an event stream checks the overlay file for changes
const EVENT_CHECK_INTERVAL: Duration = Duration::from_millis(250);

/// Event streams send the full state this often even when nothing changed,
/// which lets a page recover from a missed update and shows when a client has left
const EVENT_RESEND_INTERVAL: Duration = Duration::from_secs(10);

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
                SERVER_GENERATION.fetch_add(1, Ordering::SeqCst);
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
/// * Sends a content type and a validator so clients can revalidate with a cheap `304`
/// * Streams overlay state changes as server-sent events from `/events`
/// * Drops clients that stall for longer than `IO_TIMEOUT`
/// # Parameters
/// * `mut stream: TcpSteam` - The incoming stream of data requested by the client 
fn process_request(stream: TcpStream) {
    handle_request(
        stream,
        Path::new(&get_code_dir()),
        Path::new(&get_overlay_json_path()),
        SERVER_GENERATION.load(Ordering::SeqCst),
    );
}

fn handle_request(mut stream: TcpStream, code_dir: &Path, overlay_json: &Path, generation: usize) {
    let _ = stream.set_read_timeout(Some(IO_TIMEOUT));
    let _ = stream.set_write_timeout(Some(IO_TIMEOUT));

    let mut request_line = String::new();
    let mut if_none_match: Option<String> = None;

    // Reads only the request line and headers, capped so a client can't send unbounded data
    {
        let mut reader = BufReader::new((&stream).take(MAX_REQUEST_LINE));

        match reader.read_line(&mut request_line) {
            Ok(n) if n > 0 => (),
            _ => return,
        }

        loop {
            let mut header = String::new();

            match reader.read_line(&mut header) {
                Ok(0) | Err(_) => break,
                Ok(_) => (),
            }

            let header = header.trim_end();

            if header.is_empty() {
                break;
            }

            if let Some((name, value)) = header.split_once(':') {
                if name.eq_ignore_ascii_case("if-none-match") {
                    if_none_match = Some(value.trim().to_string());
                }
            }
        }
    }

    let mut parts = request_line.split_whitespace();
    let method = parts.next().unwrap_or_default();
    let target = parts.next().unwrap_or_default();

    if method == "GET" && target.split(['?', '#']).next() == Some("/events") {
        stream_events(stream, overlay_json, generation);
        return;
    }

    if method != "GET" {
        send_response(
            &mut stream,
            "405 METHOD NOT ALLOWED",
            "text/html; charset=utf-8",
            None,
            Some(b"<h1>405 Method Not Allowed</h1>"),
        );
        return;
    }

    let Some(path) = resolve_request_path(code_dir, target) else {
        send_not_found(&mut stream);
        return;
    };

    let Ok(bytes) = fs::read(&path) else {
        send_not_found(&mut stream);
        return;
    };

    let etag = file_etag(&path, bytes.len());

    // The client already has the current version
    if if_none_match.as_deref().is_some_and(|sent| sent.split(',').any(|tag| tag.trim() == etag)) {
        send_response(&mut stream, "304 NOT MODIFIED", content_type(&path), Some(&etag), None);
        return;
    }

    send_response(&mut stream, "200 OK", content_type(&path), Some(&etag), Some(&bytes));
}

fn send_not_found(stream: &mut TcpStream) {
    send_response(
        stream,
        "404 NOT FOUND",
        "text/html; charset=utf-8",
        None,
        Some(b"<h1>404 Not Found</h1>"),
    );
}

/// Writes a response, a failed write means the client left
///
/// `no-cache` lets clients keep a copy but makes them check it first, so changes show up right away
fn send_response(
    stream: &mut TcpStream,
    status: &str,
    content_type: &str,
    etag: Option<&str>,
    body: Option<&[u8]>,
) {
    let length = body.map_or(0, |b| b.len());
    let etag_header = etag.map_or(String::new(), |tag| format!("ETag: {tag}\r\n"));

    let header = format!(
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {length}\r\nCache-Control: no-cache\r\n{etag_header}Connection: close\r\n\r\n"
    );

    if stream.write_all(header.as_bytes()).is_ok() {
        if let Some(body) = body {
            let _ = stream.write_all(body);
        }
    }
}

/// Keeps the connection open and sends the overlay state whenever it changes
///
/// Ends when a write fails or the server that accepted it has stopped
fn stream_events(mut stream: TcpStream, overlay_json: &Path, generation: usize) {
    let header = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nCache-Control: no-cache\r\nConnection: keep-alive\r\n\r\nretry: 1000\n\n";

    if stream.write_all(header.as_bytes()).is_err() {
        return;
    }

    let mut last_stamp = None;
    let mut last_sent: Option<Instant> = None;

    while SERVER_GENERATION.load(Ordering::SeqCst) == generation {
        let stamp = fs::metadata(overlay_json)
            .ok()
            .map(|m| (m.len(), m.modified().ok()));

        let due = last_sent.map_or(true, |sent| sent.elapsed() >= EVENT_RESEND_INTERVAL);

        if stamp != last_stamp || due {
            let state = fs::read_to_string(overlay_json)
                .ok()
                .and_then(|text| serde_json::from_str::<Value>(&text).ok());

            if let Some(state) = state {
                // A compact `Value` is a single line, as an event's data has to be
                if stream.write_all(format!("data: {state}\n\n").as_bytes()).is_err() {
                    return;
                }

                last_stamp = stamp;
                last_sent = Some(Instant::now());
            }
        }

        thread::sleep(EVENT_CHECK_INTERVAL);
    }
}

/// Validator that changes whenever the file's size or modified time does
fn file_etag(path: &Path, length: usize) -> String {
    let modified = fs::metadata(path)
        .and_then(|m| m.modified())
        .ok()
        .and_then(|time| time.duration_since(std::time::UNIX_EPOCH).ok())
        .map_or(0, |d| d.as_nanos());

    format!("\"{:x}-{:x}\"", length, modified)
}

fn content_type(path: &Path) -> &'static str {
    let extension = path
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_ascii_lowercase());

    match extension.as_deref() {
        Some("html") | Some("htm") => "text/html; charset=utf-8",
        Some("css") => "text/css; charset=utf-8",
        Some("js") | Some("mjs") => "text/javascript; charset=utf-8",
        Some("json") => "application/json; charset=utf-8",
        Some("png") => "image/png",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("gif") => "image/gif",
        Some("webp") => "image/webp",
        Some("svg") => "image/svg+xml",
        Some("ico") => "image/x-icon",
        Some("woff") => "font/woff",
        Some("woff2") => "font/woff2",
        Some("ttf") => "font/ttf",
        Some("otf") => "font/otf",
        Some("mp4") => "video/mp4",
        Some("webm") => "video/webm",
        _ => "application/octet-stream",
    }
}

/// Maps a request target to a file inside the code directory
///
/// # Returns
/// * `Some(PathBuf)` - Canonical path to an existing file inside the code directory
/// * `None` - If the target is malformed, escapes the code directory, or doesn't exist
fn resolve_request_path(code_dir: &Path, target: &str) -> Option<PathBuf> {
    // Drops the query string and fragment
    let raw = target.split(['?', '#']).next()?;
    let decoded = percent_decode(raw)?;

    let root = code_dir.canonicalize().ok()?;
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn percent_decode_handles_escapes() {
        assert_eq!(percent_decode("/a%20b.html").as_deref(), Some("/a b.html"));
        assert_eq!(percent_decode("/%2e%2e/x").as_deref(), Some("/../x"));
        assert_eq!(percent_decode("/bad%2"), None);
        assert_eq!(percent_decode("/bad%zz"), None);
    }

    #[test]
    fn content_types_by_extension() {
        assert_eq!(content_type(Path::new("a/b.CSS")), "text/css; charset=utf-8");
        assert_eq!(content_type(Path::new("a/b.png")), "image/png");
        assert_eq!(content_type(Path::new("a/b")), "application/octet-stream");
    }

    struct TestServer {
        dir: PathBuf,
        address: std::net::SocketAddr,
    }

    impl TestServer {
        /// Serves a temp directory with one connection handled per request
        fn start(name: &str) -> TestServer {
            let dir = std::env::temp_dir().join(format!("falcons-http-{}-{}", name, std::process::id()));
            let _ = fs::remove_dir_all(&dir);
            fs::create_dir_all(dir.join("json")).unwrap();
            fs::write(dir.join("index.html"), "<h1>home</h1>").unwrap();
            fs::write(dir.join("json/overlay.json"), r#"{"week": "1"}"#).unwrap();

            let listener = TcpListener::bind("127.0.0.1:0").unwrap();
            let address = listener.local_addr().unwrap();
            let (root, json) = (dir.clone(), dir.join("json/overlay.json"));

            thread::spawn(move || {
                for stream in listener.incoming().flatten() {
                    let (root, json) = (root.clone(), json.clone());
                    let generation = SERVER_GENERATION.load(Ordering::SeqCst);
                    thread::spawn(move || handle_request(stream, &root, &json, generation));
                }
            });

            TestServer { dir, address }
        }

        fn request(&self, request: &str) -> String {
            let mut stream = TcpStream::connect(self.address).unwrap();
            stream.write_all(request.as_bytes()).unwrap();

            let mut response = String::new();
            stream.read_to_string(&mut response).unwrap();
            response
        }
    }

    impl Drop for TestServer {
        fn drop(&mut self) {
            let _ = fs::remove_dir_all(&self.dir);
        }
    }

    #[test]
    fn serves_files_with_a_content_type_and_validator() {
        let server = TestServer::start("serve");
        let response = server.request("GET / HTTP/1.1\r\nHost: x\r\n\r\n");

        assert!(response.starts_with("HTTP/1.1 200 OK"));
        assert!(response.contains("Content-Type: text/html; charset=utf-8"));
        assert!(response.contains("Cache-Control: no-cache"));
        assert!(response.ends_with("<h1>home</h1>"));
    }

    #[test]
    fn answers_a_matching_validator_with_304() {
        let server = TestServer::start("etag");
        let first = server.request("GET /index.html HTTP/1.1\r\n\r\n");

        let etag = first
            .lines()
            .find_map(|line| line.strip_prefix("ETag: "))
            .unwrap()
            .to_string();

        let second = server.request(&format!("GET /index.html HTTP/1.1\r\nIf-None-Match: {etag}\r\n\r\n"));

        assert!(second.starts_with("HTTP/1.1 304 NOT MODIFIED"));
        assert!(!second.contains("<h1>"));
    }

    #[test]
    fn refuses_paths_outside_the_directory_and_other_methods() {
        let server = TestServer::start("refuse");
        let secret = server.dir.parent().unwrap().join(format!("secret-{}.txt", std::process::id()));
        fs::write(&secret, "secret").unwrap();
        let name = secret.file_name().unwrap().to_string_lossy().to_string();

        for target in [format!("/../{name}"), format!("/%2e%2e/{name}"), format!("/..%2f{name}")] {
            let response = server.request(&format!("GET {target} HTTP/1.1\r\n\r\n"));
            assert!(response.starts_with("HTTP/1.1 404"), "{target} was served");
            assert!(!response.contains("secret"));
        }

        assert!(server.request("POST /index.html HTTP/1.1\r\n\r\n").starts_with("HTTP/1.1 405"));
        let _ = fs::remove_file(secret);
    }

    #[test]
    fn event_stream_sends_the_state_and_then_each_change() {
        let server = TestServer::start("events");
        let mut stream = TcpStream::connect(server.address).unwrap();
        stream.set_read_timeout(Some(Duration::from_secs(5))).unwrap();
        stream.write_all(b"GET /events HTTP/1.1\r\n\r\n").unwrap();

        let mut seen = String::new();

        fn read_until(stream: &mut TcpStream, seen: &mut String, needle: &str) {
            let mut buffer = [0u8; 1024];

            while !seen.contains(needle) {
                let n = stream.read(&mut buffer).expect("event stream went quiet");
                assert!(n > 0, "event stream closed");
                seen.push_str(&String::from_utf8_lossy(&buffer[..n]));
            }
        }

        read_until(&mut stream, &mut seen, r#"data: {"week":"1"}"#);
        assert!(seen.contains("Content-Type: text/event-stream"));

        fs::write(server.dir.join("json/overlay.json"), r#"{"week": "22"}"#).unwrap();
        read_until(&mut stream, &mut seen, r#"data: {"week":"22"}"#);
    }
}
