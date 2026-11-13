//! Handles the `Esports-Logo.png` file
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
    std::fs::read(image_path).map_err(|e| e.to_string())
}

/// Returns a Vec containing a Vec of bytes for each image
#[tauri::command]
pub async fn get_image_vec_bytes(image_paths: Vec<String>) -> Result<Vec<Vec<u8>>, String> {
    // Every read runs concurrently as an async task
    let tasks: Vec<_> = image_paths
        .into_iter()
        .map(|image_path| {
            tauri::async_runtime::spawn(async move {
                match fs::read(image_path).await {
                    // Placeholder sizes of a "Resource Not Found" file are treated as missing
                    Ok(buffer) if buffer.len() != 9379 && buffer.len() != 20 => buffer,
                    _ => vec![0_u8],
                }
            })
        })
        .collect();

    let mut image_vec: Vec<Vec<u8>> = Vec::with_capacity(tasks.len());

    for task in tasks {
        image_vec.push(task.await.map_err(|e| e.to_string())?);
    }

    Ok(image_vec)
}