//! This module downloads and extracts the overlays
//!
//! It also copies stuff from the config directory to the code directory
use reqwest::blocking::get;
use std::{
    fs::{self, File},
    io::{self, copy, BufReader},
    path::Path, thread,
};
use zip::ZipArchive;

use crate::{constants::{
    self, get_code_dir, get_code_dir_image_path, get_config_dir_image_path,
    get_config_dir_overlay_json_path, get_overlay_json_path,
}, handlers::custom_config::search_overlay};

use super::{config_handler, json_handler::read_config_json};

/// Downloads the data for the overlays on a separate thread
///
/// Used to get the zip file for ```extract_files```
///
/// # Returns
/// `Ok([String; 2])` - Returns the filename and directory the zip file is in
///
/// `Box<dyn Error>>` - Returns an error if there's an issue downloading files
pub fn download_files(url: &str, filename: &str) -> Result<[String; 2], String> {
    let directory: &str = &constants::get_config_dir();

    // Download the requested file
    let path = Path::new(directory).join(filename);

    // Get the response from the url
    let response = get(url.to_string()).map_err(|err| format!("Get Error: {}", err))?;

    // Removes the file if it already exists
    if Path::new(&path).exists() {
        let _ = fs::remove_file(&path).map_err(|err| format!("File Removal Error: {}", err));
    }

    // Create a file to save the response to
    let mut file = File::create(&path).map_err(|err| format!("File Creation Error: {}", err))?;

    // Copy the response to the file
    copy(&mut response.bytes().map_err(|error| error).unwrap().as_ref(), &mut file)
        .map_err(|err| format!("Download Copy Error: {}", err))?;

    let response: [String; 2] = [filename.to_string(), directory.to_string()];

    let overlay_path = get_config_dir_overlay_json_path();

    if Path::new(&overlay_path).exists() {
        let _ = fs::copy(constants::get_overlay_json_path(), overlay_path).map_err(|err| err);
    }

    Ok(response)
}

/// Extracts files from a .zip to a directory
///
/// # Arguments
/// * `file_path` - The path to the zip file
/// * `output_dir` - The path to output the directed contents
///
/// # Panics
/// This function will panic if there is an error writing files or removing files
///
/// # Returns
/// * `Ok(())` - The result of no IO errors
/// * `Err(std::error::Error)` - The result of an IO error
fn extract_files(file_path: &str, output_dir: &str) -> io::Result<()> {
    // Opens the file and makes an object of the archive
    let file = File::open(file_path)?;
    let mut archive = ZipArchive::new(BufReader::new(file))?;

    // For every file or folder in the archive
    for i in 0..archive.len() {
        // Name of the file or folder
        let mut file = archive.by_index(i)?;

        // Complete path to the folder holding the file or folder
        let out_path = Path::new(output_dir).join(file.enclosed_name().unwrap());

        // If the file is a folder make a folder with that path
        if file.is_dir() {
            let _ = std::fs::create_dir_all(&out_path);
        } else {
            // Otherwise if it's a file, get the parent path, make a directory of that path, then copy the file there
            if let Some(parent_dir) = out_path.parent() {
                std::fs::create_dir_all(parent_dir)?;
            }
            let mut out_file = File::create(&out_path)?;
            io::copy(&mut file, &mut out_file)?;
        }
    }

    let _ = fs::remove_file(file_path);

    Ok(())
}

/// Downloads a zip containing all of the overlays and extracts it
///
/// # Arguments
/// * `preserve` - If true, it will preserve the data in the code directory
///
/// # Returns
/// * `Ok(())` - If there are no errors
/// * `Err(String)` - If a function fails it will return the error from that function
#[tauri::command]
pub async fn download_and_extract(preserve: bool) -> Result<(), String> {
    // Preserves the data in the code directory
    if preserve {
        preserve_data()
    };

    // Removes the overlay directory before downloading the new one
    if Path::new(&get_code_dir()).exists() {
        let _ = fs::remove_dir_all(get_code_dir()).map_err(|err| return err);
    }

    let thread =
        thread::spawn(|| {download_files(&read_config_json("overlayURL"), "overlays.zip")});
        
    let result = thread.join().unwrap();

    // Values to be used when extracting the zip
    let array: [String; 2];

    match result {
        Ok(value) => array = value,
        Err(e) => return Err(e.to_string())
    };

    let file = format!("{}/{}", array[1].to_string(), &array[0].to_string());
    let dir = array[1].to_string();
    
    let _ = extract_files(&file, &dir).map_err(|err| return err);
    
    search_overlay();
    
    // Copies the downloaded image to the config directory
    let _ = fs::copy(get_code_dir_image_path(), get_config_dir_image_path()).map_err(|err| return err);

    // If there is a json
    if Path::new(&get_config_dir_overlay_json_path()).exists() {
        let _ = fs::create_dir_all(format!("{}/json", get_code_dir())).map_err(|e| e);

        let _ = fs::copy(get_config_dir_overlay_json_path(), get_overlay_json_path())
        .map_err(|err| err);
    }

    let _ = config_handler::setup_config_dir(dir).map_err(|err| return err);

    Ok(())
}


/// Preserves the data in the code directory when downloading new overlays
fn preserve_data() {
    if Path::new(&get_code_dir_image_path()).exists() {
        let _ = fs::copy(get_code_dir_image_path(), get_config_dir_image_path());
    }

    if Path::new(&get_overlay_json_path()).exists() {
        let _ = fs::copy(get_overlay_json_path(), get_config_dir_overlay_json_path());
    }
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

    let _ = download_files(format!("{}/overlays/images/{}.png", url, overlay).as_str(), format!("{}/overlays/images/{}.png", code_dir, overlay).as_str()).map_err(|e| e);

    Ok("Overlay Obtained".to_string())
}