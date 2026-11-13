use std::{collections::HashMap, path::Path};

use serde_json::Value;

use crate::{constants::{self, get_local_versions_path}, handlers::json_handler::{self, get_versions, write_json}};

use super::package_handler;

#[derive(serde::Serialize)]
pub struct OverlayState {
  pub overlay: String,
  pub player_names_left: String,
  pub player_names_right: String,
  pub score_left: String,
  pub score_right: String,
  pub team_color_left: String,
  pub team_color_right: String,
  pub team_name_left: String,
  pub team_name_right: String,
  pub week: String,
  pub wins_left: String,
  pub wins_right: String
}

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

/// Downloads the selected overlay and the files it needs, checking each against the manifest.
/// 
/// Nothing is installed or recorded as downloaded unless every file is valid.
/// 
/// # Parameters
/// * `overlay` - The name of the overlay to download.
/// 
/// # Returns
/// * `Ok(String)` - A success message indicating the overlay was downloaded.
/// * `Err(String)` - An error message if the download fails.
#[tauri::command]
pub async fn download_selected_overlay(overlay: String) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || {
        package_handler::install_overlay(&overlay)?;

        // Retrieve the version number for the overlay
        let versions = get_versions()?;

        // Write the version number to the local versions file, or -1 if the version is not found
        match versions.get(&overlay) {
            Some(version) => write_json(get_local_versions_path(), overlay, format!("version{version}")),
            None => write_json(get_local_versions_path(), overlay, format!("version{}", -1)),
        }

        Ok("Overlay Obtained".to_string())
    })
    .await
    .map_err(|e| format!("Download task failed: {}", e))?
}

/// Deletes the selected overlay's files, keeping any that other installed overlays still use.
/// 
/// # Parameters
/// * `overlay` - The name of the overlay to delete.
/// 
/// # Returns
/// * `Ok(())` - Indicates successful deletion.
/// * `Err(String)` - An error message if the deletion fails.
#[tauri::command]
pub async fn delete_selected_overlay(overlay: String) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        package_handler::remove_overlay(&overlay)?;

        // Mark the overlay as deleted in the local versions file by setting its version to 0
        write_json(get_local_versions_path(), overlay, format!("version{}", 0));

        Ok(())
    })
    .await
    .map_err(|e| format!("Delete task failed: {}", e))?
}

/// Gets the path to an overlay's image file.
/// 
/// # Parameters
/// * `overlay` - The name of the overlay.
/// 
/// # Returns
/// * `Ok(String)` - The file path to the overlay's image PNG file.
/// * `Err(String)` - An error message if the path cannot be determined.
#[tauri::command]
pub fn get_overlay_image_path(overlay: String) -> Result<String, String> {
    if !package_handler::is_valid_overlay_id(&overlay) {
        return Err(format!("Invalid overlay name: {}", overlay));
    }

    let code_dir = constants::get_code_dir();
    let image_path = format!("{}/overlays/images/{}.png", code_dir, overlay);
    
    if Path::new(&image_path).exists() {
        Ok(image_path)
    } else {
        Err(format!("Image not found for overlay: {}", overlay))
    }
}

#[tauri::command]
pub fn get_overlay_enabled(overlay: &str) -> bool {
    let config_key = format!("{}Checked", overlay);
    match json_handler::read_config_json(&config_key) {
        Ok(value) => value_is_true(&value),
        Err(_) => false,
    }
}

/// Returns whether each of the supplied overlays is enabled, reading the config once
#[tauri::command]
pub fn get_overlays_enabled(overlays: Vec<String>) -> HashMap<String, bool> {
    let config = json_handler::read_json_as_value(&constants::get_config_json_path());

    overlays
        .into_iter()
        .map(|overlay| {
            let enabled = config
                .get(format!("{}Checked", overlay))
                .map_or(false, value_is_true);
            (overlay, enabled)
        })
        .collect()
}

fn value_is_true(value: &Value) -> bool {
    if let Some(b) = value.as_bool() {
        b
    } else if let Some(s) = value.as_str() {
        s.trim().to_lowercase() == "true"
    } else {
        false
    }
}

#[tauri::command]
pub fn get_current_overlay() -> Result<String, String> {
    let config_key = "overlay";
    match json_handler::read_overlay_json(config_key) {
        Ok(value) => {
            if let Some(s) = value.as_str() {
                Ok(s.to_string())
            } else {
                Err("Current overlay value is not a string".to_string())
            }
        }
        Err(e) => Err(format!("Error reading current overlay: {}", e)),
    }
}

#[tauri::command]
pub fn get_overlay_state() -> OverlayState {
    // Reads the file once, missing keys become null like before
    let json = json_handler::read_json_as_value(&constants::get_overlay_json_path());
    let get = |key: &str| json.get(key).unwrap_or(&Value::Null).to_string();

    OverlayState {
        overlay: get("overlay"),
        player_names_left: get("playerNamesLeft"),
        player_names_right: get("playerNamesRight"),
        score_left: get("scoreLeft"),
        score_right: get("scoreRight"),
        team_color_left: get("teamColorLeft"),
        team_color_right: get("teamColorRight"),
        team_name_left: get("teamNameLeft"),
        team_name_right: get("teamNameRight"),
        week: get("week"),
        wins_left: get("winsLeft"),
        wins_right: get("winsRight")
    }
}

/// Keeps the shared files (`index.html`, CSS, JS and the font) up to date and adds the default team logo if it's missing.
#[tauri::command]
pub async fn setup_overlays() -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(package_handler::sync_shared)
        .await
        .map_err(|e| format!("Setup task failed: {}", e))?
}