//! Handles the HTTP server for the overlays
use std::{
    fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
    path::Path,
    sync::{Arc, Mutex},
    thread::{self},
};

use once_cell::sync::OnceCell;

use crate::constants::get_code_dir;

// Adds necessary traits to the ThreadData structure
#[derive(Clone, Copy, Debug)]

/// Used for sharing data between the `http_server` thread and the thread the app is running on
struct ThreadData {
    /// `stop` - For telling the thread to stop itself
    stop: bool,
}

static THREAD_DATA: OnceCell<Arc<Mutex<ThreadData>>> = OnceCell::new();

/// Sets the `THREAD_DATA` variable to a new `ThreadData` struct
pub fn setup() {
    THREAD_DATA
        .set(Arc::new(Mutex::new(ThreadData::setup())))
        .unwrap();
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

    // If the listen doesn't error, build a new thread to listen for incoming traffic
    if listener.is_ok() {
        let _ = thread::Builder::new()
            .name("http_server_thread".to_string())
            .spawn(move || ThreadData::handle_connection(listener.unwrap(), thread_data.clone()));

        Ok("Server Started".to_string())
    } else {
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

        // Connects to the server and writes it so that it reads the stop variable
        let stream = TcpStream::connect("127.0.0.1:8080");

        match stream {
            Ok(mut stream) => {
                stream.write("SHUTDOWN".as_bytes()).unwrap();

                Ok("Server Stopped".to_string())
            }
            Err(error) => Err(format!("Has the server been started? {}", error)),
        }
    } else {
        Err("Failed to stop the server: THREAD_DATA not initialized".to_string())
    }
}

impl ThreadData {
/// Handles the incoming server traffic to either send it to the request processor or exit this cycle of the loop
/// 
/// # Arguments
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
                    process_request(stream);
                }
                Err(e) => {
                    eprintln!("Failed to handle the connection: {e}");
                    continue;
                }
            }
        }
    }

    /// Returns `ThreadData { stop: false}` so the server doesn't stop on start
    fn setup() -> ThreadData {
        Self { stop: false }
    }

    /// Getter function for `stop`
    fn get_stop(&self) -> bool {
        self.stop
    }

    /// Accessor for changing `stop`
    fn set_stop(&mut self, stop_value: bool) {
        self.stop = stop_value;
    }
}

/// * Gives the client the request data as bytes
/// * It will take care of any errors with the incoming request being invalid or if the client disconnects mid request
/// * Filters out `?` from requests
/// * Sends `404.html` if it can't find the requested resource
/// # Arguments
/// * `mut stream: TcpSteam` - The incoming stream of data requested by the client 
fn process_request(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream).lines().next();

    // If the request is not empty unwrap it, otherwise return
    let request_line = if !&buf_reader.is_none() {
        buf_reader.unwrap().unwrap()
    } else {
        return;
    };

    let mut file = request_line.to_string();

    // Gets just the requested resource
    file = file.replace("GET ", "").replace(" HTTP/1.1", "");

    // Logic for processing the file path
    file = if file == "/" {
        "/index.html".to_owned()
    } else if file.contains("?") {
        file[..file.find("?").unwrap()].to_string()
    } else {
        file
    };

    // Sometimes there would be two '/', this takes care of that
    file = file.replace("//", "/");

    let file_path = get_code_dir() + &file;

    // If the file exists, read the files to a vector of bytes, otherwise just send the 404 file.
    let (status_line, contents) = if Path::new(&file_path).exists() {
        ("HTTP/1.1 200 OK", fs::read(file_path).unwrap())
    } else {
        (
            "HTTP/1.1 404 NOT FOUND",
            fs::read(format!("{}/404.html", get_code_dir())).unwrap(),
        )
    };

    let length = contents.len();

    // Format the data and write the header
    let header = format!("{status_line}\r\nContent-Length: {length}\r\n\r\n");
    // Ensures the writes are successful
    let header_write = stream.write_all(header.as_bytes());
    if header_write.is_ok() {
        header_write.unwrap();
    }
    let content_write = stream.write_all(&contents);
    if content_write.is_ok() {
        content_write.unwrap();
    }
}
