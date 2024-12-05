use std::{
    fs, io::{prelude::*, BufReader}, net::{TcpListener, TcpStream}, path::Path
};

#[tauri::command]
pub fn run_server () {
    let listener = TcpListener::bind("127.0.0.1").unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream);
    let request_line: String = buf_reader.lines().next().unwrap().unwrap();

    let mut file = request_line.to_string();

    // Gets just the requested resource
    file = file.replace("GET ", "").replace(" HTTP/1.1", "");

    file = if file == "/" {
        "index.html".to_owned()
    } else {
        file.replace("/", "")
    };

    println!("{}", file);


    let (status_line, filename) = if Path::new(&file).exists() {
        ("HTTP/1.1 200 OK", file)
    } else {
        ("HTTP/1.1 404 NOT FOUND", "404.html".to_string())
    };

    let contents = fs::read_to_string(filename).unwrap();
    let length = contents.len();

    println!("{}", request_line);

    let response =
        format!("{status_line}\r\nContent-Length: {length}\r\n\r\n{contents}");

    stream.write_all(response.as_bytes()).unwrap();
}