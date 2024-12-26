use std::{
    fs, io::{prelude::*, BufReader}, net::{TcpListener, TcpStream}, path::Path, sync::{Arc, Mutex}, thread::{self}
};

use once_cell::sync::OnceCell;

use crate::constants::get_code_dir;

// Adds necessary traits to the ThreadData structure
#[derive(Clone, Copy, Debug)]
struct ThreadData {
    stop: bool,
}

static THREAD_DATA: OnceCell<Arc<Mutex<ThreadData>>> = OnceCell::new();

// Sets the THREAD_DATA variable to a new ThreadData struct
pub fn setup() {
    THREAD_DATA
        .set(Arc::new(Mutex::new(ThreadData::setup())))
        .unwrap();
}

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

#[tauri::command]
// Stops the http server by getting the THREAD_Data and updating the struct data
pub fn stop_server() -> Result<String, String> {
    if let Some(thread_data) = THREAD_DATA.get() {
        let mut data = thread_data.lock().unwrap();
        data.set_stop(true);
        Ok("Server Stopped".to_string())
    } else {
        Err("Failed to stop the server: THREAD_DATA not initialized".to_string())
    }
}

// Handles the incoming server traffic to either send it to the request processor or exit this cycle of the loop
impl ThreadData {
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

    fn setup() -> ThreadData {
        Self { stop: false }
    }

    // Getter
    fn get_stop(&self) -> bool {
        self.stop
    }

    // Accessor
    fn set_stop(&mut self, stop_value: bool) {
        self.stop = stop_value;
    }
}


fn process_request(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream).lines().next();

    // If the request is not empty unwrap it, otherwise return
    let request_line = if !&buf_reader.is_none() {
        buf_reader.unwrap().unwrap()
    } else {
        return;
    };

    // Print what is being requested
    // println!("{}", request_line);

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
    stream.write_all(header.as_bytes()).unwrap();
    stream.write_all(&contents).unwrap();
}
