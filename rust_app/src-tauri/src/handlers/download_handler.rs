use reqwest::blocking::get;
use std::{error::Error, fs::File, io::copy, path::Path};

fn download_files() -> Result<(), Box<dyn Error>> {
    
    // Download config
    let filename: &str = "overlays.zip";
    let directory: &str = "/home/mad/Downloads";
    let url: &str = "https://codeload.github.com/MADMAN-Modding/FalconsEsportsOverlays/zip/refs/heads/main";

    // Download stuff
    let path = Path::new(directory).join(filename);
    
    let response = get(url)?;
    
    let mut file = File::create(&path)?;
    
    copy(&mut response.bytes()?.as_ref(), &mut file)?;
    
    Ok(())
}

#[tauri::command]
pub fn download_and_extract() {
    if let Err(e) = download_files() {
        eprintln!("Error {}", e);
    }
}
