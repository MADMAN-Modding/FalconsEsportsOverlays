use std::{fs, path::Path};

use crate::{constants::{self, get_code_dir, get_local_versions_path}, handlers::json_handler::{get_versions, write_json}};

use super::download_handler::download_files;

#[tauri::command]
pub fn get_overlays_list() -> Result<Vec<String>, String> {
    return find_overlays();
}

fn find_overlays() -> Result<Vec<String>, String> {
    let mut overlays: Vec<String> = Vec::new();

    // Only search if the dir exists
    if Path::new(&constants::get_overlays_path()).exists() {
        // Loop through the directory and check if there is a .html file
        for entry in std::fs::read_dir(constants::get_overlays_path()).map_err(|e| e).unwrap() {
            let entry = entry.unwrap();
            
            // If the path is a file and it has a .html file, it will write the path to the config file
            if entry.path().is_file() && entry.path().to_str().unwrap().contains(".html") {
                overlays.push(entry.file_name().into_string().unwrap().replace(".html", "").into());
            }
        }
    }

    overlays.sort();

    Ok(overlays)
}

#[tauri::command]
pub fn download_selected_overlay(overlay: String) -> Result<String, String> {
    let url = "https://madman-modding.github.io/FalconsEsportsOverlaysData";

    let code_dir = get_code_dir();

    // Downloads the overlay html
    let _ = download_files(format!("{}/overlays/{}.html", url, overlay).as_str(), format!("{}/overlays/{}.html", code_dir, overlay).as_str()).map_err(|e| e);

    // Downloads the overlay css
    let _ = download_files(format!("{}/css/{}.css", url, overlay).as_str(), format!("{}/css/{}.css", code_dir, overlay).as_str()).map_err(|e| e);

    // Downloads the overlay javascript
    let _ = download_files(format!("{}/js/{}.js", url, overlay).as_str(), format!("{}/js/{}.js", code_dir, overlay).as_str()).map_err(|e| e);

    // Downloads the Logo
    let _ = download_files(format!("{}/overlays/images/{}.png", url, overlay).as_str(), format!("{}/overlays/images/{}.png", code_dir, overlay).as_str()).map_err(|e| e);

    // Used so the temporary value isn't dropped
    let binding = get_versions();
    let version = binding.get(&overlay);

    // If the version number exists, write it to the local_version file, otherwise write -1
    match version {
        Some(version) => write_json(get_local_versions_path(), overlay, format!("version{version}")),
        None => write_json(get_local_versions_path(), overlay, format!("version{}", -1)),
    }

    Ok("Overlay Obtained".to_string())
}

#[tauri::command]
pub fn delete_selected_overlay(overlay: String) -> Result<(), String> {
    let code_dir = get_code_dir();
    
    let _ = fs::remove_file(format!("{}/overlays/{}.html", code_dir, overlay));

    let _ = fs::remove_file(format!("{}/css/{}.css", code_dir, overlay));

    let _ = fs::remove_file(format!("{}/js/{}.js", code_dir, overlay));

    let _ = fs::remove_file(format!("{}/overlays/images/{}.png", code_dir, overlay));

    write_json(get_local_versions_path(), overlay, format!("version{}", -2));

    Ok(())
}