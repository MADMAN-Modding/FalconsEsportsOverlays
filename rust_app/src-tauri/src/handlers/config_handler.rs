//! This module is used for handling the data in the config

use std::{fs, path::Path};

use super::{download_handler::download_and_extract, json_handler};
use crate::constants::{
    get_config_dir, get_config_dir_image_path, get_config_dir_overlay_json_path,
};

/// Copies the necessary files to `config_dir` from the `code_dir`
///
/// # Arguments
/// * `config_dir` - The config directory
///
/// # Returns
/// * `Ok(())` - Empty Ok if no IO errors
/// * `Err(std::io::Error)` - Returns an Error if there's an IO error copying files
///
/// # Examples
/// ```ignore
/// let path = "/home/user/.config/config-dir-for-app";  
/// let setup_result = setup_config_dir(path);
/// assert_eq!(setup_result, Ok(()));
/// ```
pub fn setup_config_dir(config_dir: String) -> Result<(), std::io::Error> {
    let logo = format!(
        "{}{}",
        &config_dir, "/FalconsEsportsOverlays-main/images/Esports-Logo.png"
    );

    if let Err(e) = fs::copy(logo, format!("{}{}", &config_dir, "/Esports-Logo.png")) {
        return Err(e);
    }

    json_handler::init_json(format!("{}/overlay.json", get_config_dir()));

    let overlay_config = format!(
        "{}{}",
        &config_dir, "/FalconsEsportsOverlays-main/json/overlay.json"
    );

    if let Err(e) = fs::copy(format!("{}/overlay.json", get_config_dir()), overlay_config) {
        return Err(e);
    }

    Ok(())
}

/// Removes all the files in the config folder
///
/// # Returns
/// * `Ok(())` - Returns an empty `Ok` if no errors occur
/// * `Err(String)` - Returns an error if there are io errors or errors downloading data
#[tauri::command]
pub fn reset_overlays() -> Result<(), String> {
    let _ =
        fs::remove_file(Path::new(&get_config_dir_overlay_json_path())).map_err(|err| return err);
    let _ = fs::remove_file(Path::new(&get_config_dir_image_path())).map_err(|err| return err);

    let download_result = download_and_extract();

    match download_result {
        Ok(_) => Ok(()),
        Err(error) => Err(format!("Downloading Error: {}", error)),
    }
}
