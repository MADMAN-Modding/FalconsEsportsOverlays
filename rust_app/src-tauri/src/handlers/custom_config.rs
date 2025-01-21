use super::json_handler::{read_custom_json, write_json};

use crate::constants::{get_config_json_path, get_custom_config_path};

fn update_config(key: &str, value: String) {
    write_json(get_config_json_path(), key.to_string(), value);
}

#[tauri::command]
pub fn setup_custom_config(config_file: Vec<u8>) -> Result<String, String> {
    let _ = std::fs::write(get_custom_config_path(), config_file).map_err(|err| return err.to_string());

    let custom_keys: Vec<&str> = ["columnColor", "imageURL", "overlayURL"].to_vec();

    for key in custom_keys {
        if read_custom_json(key) == "null" {
            continue;
        }
        update_config(key, read_custom_json(key));
    }

    Ok("Setup Successful".to_string())
}