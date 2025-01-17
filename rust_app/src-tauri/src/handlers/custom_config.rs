use std::fs;

use super::{
    download_handler::download_files,
    json_handler::{read_config_json, read_custom_json, write_json},
};
use crate::constants::{get_config_json_path, get_custom_config_path};

fn download_logo() -> Result<String, String> {
    let image_location = read_custom_json("imageURL");

    let download_result = download_files(&image_location, Some("Esports-Logo.png"));

    if download_result.is_err() {
        return Err(download_result.unwrap_err().to_string());
    }

    Ok("Custom Config Successfully Applied".to_string())
}

fn update_config(key: &str, value: String) {
    write_json(get_config_json_path(), key.to_string(), value);
}

pub fn setup_custom_config(config_file: Vec<u8>) -> Result<String, String> {
    let _ = fs::write(get_custom_config_path(), config_file).map_err(|err| return err.to_string());

    let custom_keys: Vec<&str> = ["columnColor", "imageURL", "overlayURL", "defaultURL"].to_vec();

    for key in custom_keys {
        update_config(key, read_custom_json(key));
    }

    Ok("Setup Successful".to_string())
}