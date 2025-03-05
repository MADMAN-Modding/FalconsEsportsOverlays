//! This module is used for read and writing the json data used for the overlays and the app
use std::{fs, path::Path};

use serde_json::{json, Value};

use crate::constants;

use super::download_handler::download_files;

/// Reads the overlay json and returns the value of the requested key
/// 
/// # Arguments
/// * `key: &str` - The key to be read from the json file
/// 
/// # Returns
/// * `String` - The data at the desired key 
#[tauri::command]
pub fn read_overlay_json(key: &str) -> String {
    read_json(key, constants::get_overlay_json_path())
}

/// Reads the config json and returns the value of the requested key
/// 
/// # Arguments
/// * `key: &str` - The key to be read from the json file
/// 
/// # Returns
/// * `String` - The data at the desired key 
#[tauri::command]
pub fn read_config_json(key: &str) -> String {
    read_json(key, constants::get_config_json_path())
}

/// Reads the config json and returns the value of the requested key
/// 
/// # Arguments
/// * `key: &str` - The key to be read from the json file
/// 
/// # Returns
/// * `String` - The data at the desired key 
#[tauri::command]
pub fn read_custom_json(key: &str) -> String {
    read_json(key, constants::get_custom_config_path())
}

/// Reads the json at the supplied path and returns the value of the requested key
/// 
/// # Arguments
/// * `key: &str` - The key to be read from the json file
/// * `path: String` - The path to the json file
/// 
/// #Returns
/// * 'String' - The data at the desired key
#[tauri::command]
pub fn read_json(key: &str, path: String) -> String {
    let json_data: Value = open_json(path);

    json_data[key].to_string().replace("\"", "")
}

/// Opens the json file with the supplied path
/// 
/// # Arguments
/// * `path: String` - The path to the JSON file to read
/// 
/// # Returns
/// * `Value` - Contains the JSON data
/// 
/// # Examples
/// ```ignore
/// open_json("random_path/overlay.json");
/// ```
fn open_json(path: String) -> Value {
    let json_data: Value;

    // Checks to make sure that the JSON file is there, if it isn't it makes it
    if Path::new(&path).exists() {
        json_data = {
            let file_content: String = fs::read_to_string(&path).expect("File not found");
            serde_json::from_str::<Value>(&file_content).expect("Error serializing to JSON")
        };
    } else {
        json_data = init_json(path);
    }

    // Returns the json data
    json_data
}

/// This function is called if the JSON being read doesn't exist
/// 
/// It after making the file it will try to read the file and then return that value
/// 
/// # Arguments
/// * `path: String` - The path to the JSON file to read
/// 
/// # Returns
/// * `Value` - Contains the JSON data
pub fn init_json(path: String) -> Value {
    // Creating the directories
    let _ = std::fs::create_dir_all(Path::new(&path).parent().unwrap());

    // Initializes the json_data variable
    let json_data: Value;

    if path.contains("overlay.json") {
        json_data = json!({
            "teamNameLeft": "DC Falcons Red",
            "teamNameRight": "That other team",
            "winsLeft": "0",
            "winsRight": "0",
            "teamColorLeft": "#BE0F32",
            "teamColorRight": "#0120AC",
            "overlay": "kart",
            "week": "0",
            "scoreLeft": "0",
            "scoreRight": "0",
            "playerNamesLeft": "MADMAN-Modding",
            "playerNamesRight": "Check out my Github"
        });
    } else {
        json_data = get_default_json_data();
    }

    // Creating the JSON file
    fs::write(
        &path,
        serde_json::to_string_pretty(&json_data).expect(
            "Error 
    serializing to JSON",
        ),
    )
    .expect("Error writing file");

    // Trying to open the JSON again
    open_json(path)
}

/// Writes to the JSON file at the supplied path
/// 
/// # Arguments
/// * `path: String` - Path to the JSON file
/// * `json_key: String` - Key to write to
/// * `value: String` ` Value to write to the key`
/// 
/// # Examples
/// ```ignore
/// write_json("random_path/overlay.json", "overlay", "kart");
/// ```
#[tauri::command]
pub fn write_json(path: String, json_key: String, mut value: String) {
    // Cloning the data because a borrow won't work in this case
    let mut json_data = open_json(path.clone());

    // Writes a bool if the json_key is a checked value which must be a bool
    if json_key.contains("Checked") || json_key.contains("autoUpdate") {
        let bool_value = match value.to_lowercase().as_str() {
            "true" => true,
            "false" => false,
            _ => false,
        };

        json_data[json_key] = serde_json::Value::Bool(bool_value);
    } else {
        value = value.replace("\"", "");

        json_data[json_key] = serde_json::Value::String(value);
    }

    fs::write(
        path,
        serde_json::to_string_pretty(&json_data).expect("Error serializing to JSON"),
    )
    .expect("Error writing file");
}

pub fn write_config(json_key: String, value: &str) {
    write_json(constants::get_config_json_path(), json_key, value.to_string());
}

/// Resets the config
#[tauri::command]
pub fn reset_config() {
    let default_json = get_default_json_data();
    for key in default_json.as_object().unwrap() {
        // If the key is a string, it will write the key and value to the config file
        let value = key.1.to_string().replace("\"", "");

        write_config(key.0.to_owned(), value.as_str());
    }
}

#[tauri::command]
pub fn get_name_map() -> Value {
    let download = download_files("https://dchs-esports.org/static/names.json", "names.json");

    open_json(format!("{}/{}", download.as_ref().unwrap()[1], download.as_ref().unwrap()[0]))
}

pub fn get_default_json_data() -> serde_json::Value {
    json!({
        "appColor": "#bf0f35",
        "columnColor": "#ffffff",
        "overlayURL" : "https://codeload.github.com/MADMAN-Modding/FalconsEsportsOverlays/zip/refs/heads/main",
        "overlay_dir": "FalconsEsportsOverlays-main",
        "ssbuChecked": true,
        "kartChecked": true,
        "overwatchChecked": true,
        "rocketLeagueChecked": true,
        "splatChecked": true,
        "valChecked": true,
        "hearthChecked": true,
        "lolChecked": true,
        "chessChecked": true,
        "maddenChecked": true,
        "nba2KChecked": true,
        "autoUpdate": false,
        "autoServer": false
    })
}