use std::{
    fs, io::{prelude::*, BufReader}, net::TcpListener, path::Path
};

#[tauri::command]
pub async fn run_server () -> Result<String, String> {
    let listener = TcpListener::bind("127.0.0.1:8080");

    if listener.is_ok() {
        handle_connection(listener.unwrap());
        Ok("Server Started".to_string())
    } else {
        Err(format!("Error Starting Server: {}", listener.unwrap_err()))
    }
}

async fn handle_connection(listener: TcpListener) {
    for stream in listener.incoming() {

        let mut stream = stream.unwrap();    

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
}