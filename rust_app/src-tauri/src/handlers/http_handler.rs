use std::{
    fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
    path::Path, thread,
};

use crate::constants::get_code_dir;

#[tauri::command]
pub async fn run_server() -> Result<String, String> {
    let listener = TcpListener::bind("127.0.0.1:8080");

    if listener.is_ok() {
        let _ = thread::Builder::new().name("http_server_thread".to_string()).spawn(|| {handle_connection(listener.unwrap())});
        Ok("Server Started".to_string())
    } else {
        Err(format!("Error Starting Server: {}", listener.unwrap_err()))
    }
}

fn handle_connection(listener: TcpListener) {
    for stream in listener.incoming() {

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

fn process_request(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream).lines().next();

    let request_line = if !&buf_reader.is_none() {
        buf_reader.unwrap().unwrap()
    } else {
        return;
    };

    println!("{}", request_line);


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
    
    // TODO: Add logic to handle a '?' on requested resouces
    let (status_line, contents) = if Path::new(&file_path).exists() {
        ("HTTP/1.1 200 OK", fs::read(file_path).unwrap())
    } else {
        println!("{}/404.html", get_code_dir());
        ("HTTP/1.1 404 NOT FOUND", fs::read(format!("{}/404.html", get_code_dir())).unwrap())
    };

    let length = contents.len();

    let header = format!("{status_line}\r\nContent-Length: {length}\r\n\r\n");
    stream.write_all(header.as_bytes()).unwrap();
    stream.write_all(&contents).unwrap();
}