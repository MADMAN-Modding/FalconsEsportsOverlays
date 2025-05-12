//! Handles the `Esports-Logo.png` file
use std::{
    fs::File,
    io::{BufReader, Read}, thread::{self, JoinHandle}, vec,
};
use tokio::fs;

use crate::constants::get_code_dir_image_path;

/// Copies the image from bytes to the image in the code directory
/// 
/// # Parameters
/// * `bytes: Vec<u8>` - A vector of all the bytes of the image
/// 
/// # Returns
/// * `Ok(String)` - Value to pushed to the fronted on success
/// * 'Err(String)` - Value to push to the frontend of error
/// 
#[tauri::command]
pub async fn copy_image(bytes: Vec<u8>) -> Result<String, String> {
    let write_result = fs::write(get_code_dir_image_path(), bytes).await;

    match write_result {
        Ok(_) => Ok("Write Successful".to_string()),
        Err(err) => Err(format!("Write Error: {}", err)),
    }
}

/// Returns the bytes of the image in the code dir as bytes
/// 
/// These bytes are used to display the image on the frontend
/// 
/// # Returns
/// * `Ok(Vec<u8>)` - If the read is successful it will send the data to the frontend
/// * 'Err(String)` - If the read fails, it will send the error to the frontend and the default image will be displayed
#[tauri::command]
pub fn get_image_bytes(image_path: String) -> Result<Vec<u8>, String> {
    let image: Result<File, std::io::Error> =
        File::open(image_path);

    if image.is_err() {
        return Err(image.unwrap_err().to_string());
    }
    
    let mut reader: BufReader<File> = BufReader::new(image.unwrap());

    let mut buffer: Vec<u8> = Vec::new();

    let read_result = reader.read_to_end(&mut buffer);

    match read_result {
        Ok(_) => Ok(buffer),
        Err(error) => Err(error.to_string()),
    }

}

/// Returns a Vec containing a Vec of bytes for each image
#[tauri::command]
pub async fn get_image_vec_bytes(image_paths: Vec<String>) -> Result<Vec<Vec<u8>>, String> {
    threaded_get_image_vec_bytes(image_paths).await
}

/// Multithreaded file to byte search
async fn threaded_get_image_vec_bytes(image_paths: Vec<String>) -> Result<Vec<Vec<u8>>, String> {
    let mut image_vec: Vec<Vec<u8>> = Vec::new();
    
    let mut threads: Vec<JoinHandle<Result<Vec<u8>, String>>> = Vec::new();

    // Loop through the image paths and read the images
    for image_path in image_paths {
        let thread: JoinHandle<Result<Vec<u8>, String>> = thread::spawn(move|| {    
            // Open the image file
            let image: Result<File, std::io::Error> =
                File::open(image_path.clone());

            if image.is_err() {
                return Ok(vec![0 as u8]);
            }
            
            let mut reader: BufReader<File> = BufReader::new(image.unwrap());

            let mut buffer: Vec<u8> = Vec::new();

            reader.read_to_end(&mut buffer).map_err(|e| e.to_string()).unwrap();


            // If the file is a "Resource Not Found" file, return a blank vector
            if buffer.len() == 20 {
                return Ok(vec![0 as u8]);
            }

            Ok(buffer)
        
        });

        threads.push(thread);
    }

    for thread in threads {
        match thread.join().unwrap() {
            Ok(bytes) => image_vec.push(bytes),
            Err(err) => return Err(err),
        }
    }

    Ok(image_vec)
        
}