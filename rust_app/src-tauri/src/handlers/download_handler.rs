use reqwest::blocking::get;
use zip::ZipArchive;
use std::{error::Error, fs::{self, File}, io::{self, copy, BufReader}, path::Path};

use crate::constants;

fn download_files() -> Result<[String; 2], Box<dyn Error>> {
    // Download config
    let filename: &str = "overlays.zip";
    let directory: &str = &constants::get_config_dir();
    let url: &str = "https://codeload.github.com/MADMAN-Modding/FalconsEsportsOverlays/zip/refs/heads/main";

    // Download stuff
    let path = Path::new(directory).join(filename);
    
    let response = get(url)?;
    
    let mut file = File::create(&path)?;
    
    copy(&mut response.bytes()?.as_ref(), &mut file)?;
    
    let response: [String; 2] = [filename.to_string(), directory.to_string()];

    Ok(response)
}

fn extract_files(file_path: &str, output_dir: &str) -> io::Result<()> {
    // Opens the file and makes an object of the archive
    let file = File::open(file_path)?;
    let mut archive = ZipArchive::new(BufReader::new(file))?;


    // For every file or folder in the archive
    for i in 0..archive.len() {
        // Name of the file or folder
        let mut file = archive.by_index(i)?;

        // Complete path to the folder holding the file or folder
        let out_path = Path::new(output_dir).join(file.sanitized_name());

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

fn setup_config_dir(config_dir: String) -> Result<(), std::io::Error> {
    let logo = format!("{}{}", &config_dir, "/FalconsEsportsOverlays-main/images/Esports-Logo.png");

    if let Err(e) = fs::copy(logo, format!("{}{}", &config_dir, "/Esports-Logo.png")) {
        return Err(e);
    }

    let overlay_config = format!("{}{}", &config_dir, "/FalconsEsportsOverlays-main/json/overlay.json");

    if let Err(e) = fs::copy(overlay_config, format!("{}{}", &config_dir, "/overlay.json")) {
        return Err(e);
    }
    
    Ok(())
}

#[tauri::command]
pub fn download_and_extract() {
    let result:Result<[String; 2], Box<dyn Error>> = download_files();

    // Initial variables for storing dir and file
    let dir: String;
    let file: String;

    match result {
        Ok(array) => {
            file = format!("{}/{}", array[1].to_string(), &array[0].to_string());
            dir = array[1].to_string();

            if let Err(e) = extract_files(&file, &dir) {
                eprintln!("Extract Error: {}", e);
            } else if let Err(e) = setup_config_dir(dir) {
                eprintln!("Setup Error: {}", e);
            }
        }

        Err(e) => {
            eprintln!("Download Error: {}", e);
            return;
        }
    }
}
