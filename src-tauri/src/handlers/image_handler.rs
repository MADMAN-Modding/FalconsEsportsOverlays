//! Handles the `Esports-Logo.png` file
use tauri::ipc::{InvokeBody, Request, Response};
use tokio::fs;

use crate::constants::get_code_dir_image_path;

/// Copies the image from the raw request body to the image in the code directory
/// 
/// The frontend sends the image as an `ArrayBuffer`/`Uint8Array` so it isn't serialized to JSON
/// 
/// # Returns
/// * `Ok(String)` - Value to pushed to the fronted on success
/// * 'Err(String)` - Value to push to the frontend of error
/// 
#[tauri::command]
pub async fn copy_image(request: Request<'_>) -> Result<String, String> {
    let InvokeBody::Raw(bytes) = request.body() else {
        return Err("Expected the image as raw bytes".to_string());
    };

    let write_result = fs::write(get_code_dir_image_path(), bytes).await;

    match write_result {
        Ok(_) => Ok("Write Successful".to_string()),
        Err(err) => Err(format!("Write Error: {}", err)),
    }
}

/// Returns the bytes of the image at the path as raw binary
/// 
/// These bytes are used to display the image on the frontend
/// 
/// # Returns
/// * `Ok(Response)` - The file contents, received as an `ArrayBuffer` on the frontend
/// * 'Err(String)` - If the read fails, it will send the error to the frontend and the default image will be displayed
#[tauri::command]
pub fn get_image_bytes(image_path: String) -> Result<Response, String> {
    std::fs::read(image_path)
        .map(Response::new)
        .map_err(|e| e.to_string())
}

/// Returns every image packed into one binary buffer
/// 
/// Layout, all integers are little-endian `u32`: the image count, then for each image its
/// byte length followed by its bytes. A length of `0` means the image is missing.
#[tauri::command]
pub async fn get_image_vec_bytes(image_paths: Vec<String>) -> Result<Response, String> {
    // Every read runs concurrently as an async task
    let tasks: Vec<_> = image_paths
        .into_iter()
        .map(|image_path| {
            tauri::async_runtime::spawn(async move {
                match fs::read(image_path).await {
                    // Placeholder sizes of a "Resource Not Found" file are treated as missing
                    Ok(buffer) if buffer.len() != 9379 && buffer.len() != 20 => buffer,
                    _ => Vec::new(),
                }
            })
        })
        .collect();

    let mut packed: Vec<u8> = Vec::new();
    packed.extend_from_slice(&(tasks.len() as u32).to_le_bytes());

    for task in tasks {
        let image = task.await.map_err(|e| e.to_string())?;
        packed.extend_from_slice(&(image.len() as u32).to_le_bytes());
        packed.extend_from_slice(&image);
    }

    Ok(Response::new(packed))
}