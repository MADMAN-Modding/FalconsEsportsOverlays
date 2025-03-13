use std::path::Path;

use crate::constants;

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