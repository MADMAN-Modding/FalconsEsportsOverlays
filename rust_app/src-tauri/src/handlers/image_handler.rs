//! Handles the `Esports-Logo.png` file
use std::{
    fs::File,
    io::{BufReader, Read},
};
use tokio::fs;

use crate::constants::get_code_dir_image_path;

/// Copies the image from bytes to the image in the code directory
/// 
/// # Arguments
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
/// * `Ok(Vec<u8>>` - If the read is successful it will send the data to the frontend
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