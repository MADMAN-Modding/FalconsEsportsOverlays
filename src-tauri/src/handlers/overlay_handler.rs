use std::{fs, path::Path};

use crate::{constants::{self, get_code_dir, get_local_versions_path}, handlers::json_handler::{get_versions, write_json}};

use super::download_handler::download_files;

/// Retrieves the list of downloaded overlays by scanning the overlays directory.
/// 
/// # Returns
/// * `Ok(Vec<String>)` - A sorted list of overlay names (without the `.html` extension).
/// * `Err(String)` - An error message if the directory cannot be read.
#[tauri::command]
pub fn get_overlays_list() -> Result<Vec<String>, String> {
    return find_overlays();
}

/// Scans the overlays directory for `.html` files and returns their names.
/// 
/// # Returns
/// * `Ok(Vec<String>)` - A sorted list of overlay names (without the `.html` extension).
/// * `Err(String)` - An error message if the directory cannot be read.
fn find_overlays() -> Result<Vec<String>, String> {
    let mut overlays: Vec<String> = Vec::new();

    // Only search if the directory exists
    if Path::new(&constants::get_overlays_path()).exists() {
        // Loop through the directory and check for `.html` files
        for entry in std::fs::read_dir(constants::get_overlays_path()).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            
            // If the path is a file and has a `.html` extension, add its name to the list
            if entry.path().is_file() && entry.path().to_str().unwrap().contains(".html") {
                overlays.push(entry.file_name().into_string().unwrap().replace(".html", "").into());
            }
        }
    }

    // Sort the list of overlays alphabetically
    overlays.sort();

    Ok(overlays)
}

/// Downloads the selected overlay files (HTML, CSS, JS, and PNG) from a remote URL.
/// 
/// # Arguments
/// * `overlay` - The name of the overlay to download.
/// 
/// # Returns
/// * `Ok(String)` - A success message indicating the overlay was downloaded.
/// * `Err(String)` - An error message if the download fails.
#[tauri::command]
pub fn download_selected_overlay(overlay: String) -> Result<String, String> {
    let url = "https://madman-modding.github.io/FalconsEsportsOverlaysData";

    let code_dir = get_code_dir();

    // Downloads the overlay HTML file
    let _ = download_files(format!("{}/overlays/{}.html", url, overlay).as_str(), format!("{}/overlays/{}.html", code_dir, overlay).as_str()).map_err(|e| e.to_string());

    // Downloads the overlay CSS file
    let _ = download_files(format!("{}/css/{}.css", url, overlay).as_str(), format!("{}/css/{}.css", code_dir, overlay).as_str()).map_err(|e| e.to_string());

    // Downloads the overlay JavaScript file
    let _ = download_files(format!("{}/js/{}.js", url, overlay).as_str(), format!("{}/js/{}.js", code_dir, overlay).as_str()).map_err(|e| e.to_string());

    // Downloads the overlay logo (PNG file)
    let _ = download_files(format!("{}/overlays/images/{}.png", url, overlay).as_str(), format!("{}/overlays/images/{}.png", code_dir, overlay).as_str()).map_err(|e| e.to_string());

    // Retrieve the version number for the overlay
    let binding = get_versions().unwrap();
    let version = binding.get(&overlay);

    // Write the version number to the local versions file, or -1 if the version is not found
    match version {
        Some(version) => write_json(get_local_versions_path(), overlay, format!("version{version}")),
        None => write_json(get_local_versions_path(), overlay, format!("version{}", -1)),
    }

    Ok("Overlay Obtained".to_string())
}

/// Deletes the selected overlay files (HTML, CSS, JS, and PNG) from the local filesystem.
/// 
/// # Arguments
/// * `overlay` - The name of the overlay to delete.
/// 
/// # Returns
/// * `Ok(())` - Indicates successful deletion.
/// * `Err(String)` - An error message if the deletion fails.
#[tauri::command]
pub fn delete_selected_overlay(overlay: String) -> Result<(), String> {
    let code_dir = get_code_dir();
    
    // Delete the overlay HTML file
    let _ = fs::remove_file(format!("{}/overlays/{}.html", code_dir, overlay)).map_err(|e| e.to_string())?;

    // Delete the overlay CSS file
    let _ = fs::remove_file(format!("{}/css/{}.css", code_dir, overlay)).map_err(|e| e.to_string())?;

    // Delete the overlay JavaScript file
    let _ = fs::remove_file(format!("{}/js/{}.js", code_dir, overlay)).map_err(|e| e.to_string())?;

    // Delete the overlay logo (PNG file)
    let _ = fs::remove_file(format!("{}/overlays/images/{}.png", code_dir, overlay)).map_err(|e| e.to_string())?;

    // Mark the overlay as deleted in the local versions file by setting its version to -2
    write_json(get_local_versions_path(), overlay, format!("version{}", -2));

    Ok(())
}

/// Sets up the initial overlay files by downloading them if they do not already exist.
/// This includes the main `index.html`, associated CSS, JS, and font files, as well as the Esports logo.
#[tauri::command]
pub fn setup_overlays() {
    // Downloads `index.html` if it doesn't exist
    if !Path::new(&format!("{}/index.html", get_code_dir())).exists() {
        let _ = download_files("https://madman-modding.github.io/FalconsEsportsOverlaysData/index.html", format!("{}/index.html", get_code_dir()).as_str());
        let _ = download_files("https://madman-modding.github.io/FalconsEsportsOverlaysData/css/index.css", format!("{}/css/index.css", get_code_dir()).as_str());
        let _ = download_files("https://madman-modding.github.io/FalconsEsportsOverlaysData/js/index.js", format!("{}/js/index.js", get_code_dir()).as_str());
        let _ = download_files("https://madman-modding.github.io/FalconsEsportsOverlaysData/css/ethnocentric.woff", format!("{}/css/ethnocentric.woff", get_code_dir()).as_str());
        let _ = download_files("https://madman-modding.github.io/FalconsEsportsOverlaysData/js/overlays.js", format!("{}/js/overlays.js", get_code_dir()).as_str());
    }

    // Downloads the Esports logo if it doesn't exist
    if !Path::new(&format!("{}/images/Esports-Logo.png", get_code_dir())).exists() {
        let _ = download_files("https://madman-modding.github.io/FalconsEsportsOverlaysData/images/Esports-Logo.png", format!("{}/images/Esports-Logo.png", get_code_dir()).as_str());
    }   
}