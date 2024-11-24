use reqwest::blocking::get;
use zip::ZipArchive;
use std::{error::Error, fs::File, io::{self, copy, BufReader}, path::Path};

fn download_files() -> Result<[String; 2], Box<dyn Error>> {
    // Download config
    let filename: &str = "overlays.zip";
    let directory: &str = "/home/mad/Downloads";
    let url: &str = "https://codeload.github.com/MADMAN-Modding/FalconsEsportsOverlays/zip/refs/heads/main";

    // Download stuff
    let path = Path::new(directory).join(filename);
    
    let response = get(url)?;
    
    let mut file = File::create(&path)?;
    
    copy(&mut response.bytes()?.as_ref(), &mut file)?;
    
    let response: [String; 2] = [filename.to_string(), directory.to_string()];

    Ok(response)
}

fn extract_files(file_path : &str, output_dir: &str) -> io::Result<()> {
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
                eprintln!("Extract Error {}", e);
            }
        }

        Err(e) => {
            eprintln!("Download Error: {}", e);
            return;
        }
    }
}
