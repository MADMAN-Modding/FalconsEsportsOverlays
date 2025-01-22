use std::{fs, path::Path};

use super::json_handler::{read_custom_json, write_config, write_json};

use crate::constants::{get_config_dir, get_config_json_path, get_custom_config_path};

fn update_config(key: &str, value: String) {
    write_json(get_config_json_path(), key.to_string(), value);
}

#[tauri::command]
pub fn setup_custom_config(config_file: Vec<u8>) -> Result<String, String> {
    let _ = std::fs::write(get_custom_config_path(), config_file).map_err(|err| return err.to_string());

    let custom_keys: Vec<&str> = ["columnColor", "imageURL", "overlayURL", "appColor", "overlay_dir"].to_vec();

    for key in custom_keys {
        if read_custom_json(key) == "null" {
            continue;
        }
        update_config(key, read_custom_json(key));
    }

    match fs::remove_file(get_custom_config_path()) {
        Ok(_) => Ok("Setup Successful".to_string()),
        Err(e) => return Err(e.to_string())
    }
}

/// Searches for the overlay folder in the config directory
pub fn search_overlay() {
    let overlay_path = get_config_dir();

    // Loop through the directory and check if there is a index.html file
    for entry in fs::read_dir(overlay_path).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();

        // If the path is a directory and it has a index.html file, it will write the path to the config file
        if path.is_dir() {
            if Path::new(&format!("{}/index.html", path.to_str().unwrap())).exists() {
                write_config("overlay_dir".to_string(), path.file_name().unwrap().to_str().unwrap());
                return;
            }
        }
    }
}