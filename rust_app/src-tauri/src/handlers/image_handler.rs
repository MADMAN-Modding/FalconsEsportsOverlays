use std::{
    error::Error,
    fs::File,
    io::{BufReader, Read}
};
use tokio::fs;

use crate::constants::{self, get_code_dir_image_path};

#[tauri::command]
pub async fn copy_image(bytes: Vec<u8>) -> Result<String, String> {
    // println!("{}", &bytes);

    let write_result = fs::write(get_code_dir_image_path(), bytes).await;

    match  write_result {
        Ok(_) => Ok("Write Successful".to_string()),
        Err(err) => Err(format!("Write Error: {}", err))
    }
}

#[tauri::command]
pub fn get_tauri_bytes() -> Result<Vec<u8>, String> {
    let result = get_image_bytes();

    match result {
        Ok(result) => Ok(result),
        Err(err) => Err(err.to_string()),
    }
}

fn get_image_bytes() -> Result<Vec<u8>, Box<dyn Error>> {
    let image: Result<File, std::io::Error> =
        File::open(constants::get_code_dir_image_path()).map_err(|err| return err);

    let mut reader: BufReader<File> = BufReader::new(image.unwrap());

    let mut buffer: Vec<u8> = Vec::new();

    reader.read_to_end(&mut buffer)?;

    Ok(buffer)
}
