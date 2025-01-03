use std::{fs, path::Path};

use serde_json::{json, Value};

use crate::constants;

#[tauri::command]
pub fn read_overlay_json(key: &str) -> String {
    let json_data: Value = open_json(constants::get_overlay_json_path());

    json_data[key].to_string()
}

#[tauri::command]
pub fn read_config_json(key: &str) -> String {
    let json_data: Value = open_json(constants::get_config_json_path());

    json_data[key].to_string()
}

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

    // Prints the entire JSON, mainly for debugging
    // println!("{:?}", serde_json::to_string_pretty(&json_data).expect("Error parsing to JSON"));

    // Returns the json data
    json_data
}

pub fn init_json(path: String) -> Value {
    // Creating the directories
    let _ = std::fs::create_dir_all(Path::new(&path).parent().unwrap());

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
        json_data = json!({
            "appTheme": "#bf0f35",
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
            "nba2KChecked": true
        })
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

/**
 * path: Location of json file
 * json_key: Key to update in the json
 * value: Value to update key to
 */
#[tauri::command]
pub fn write_json(path: String, json_key: String, value: String) {
    // Cloning the data because a borrow won't work in this case
    let mut json_data = open_json(path.clone());

    // Writes a bool if the json_key is a checked value which must be a bool
    if json_key.contains("Checked") {
        let bool_value = match value.to_lowercase().as_str() {
            "true" => true,
            "false" => false,
            _ => false,
        };

        json_data[json_key] = serde_json::Value::Bool(bool_value);
    } else {
        json_data[json_key] = serde_json::Value::String(value);
    }

    fs::write(
        path,
        serde_json::to_string_pretty(&json_data).expect("Error serializing to JSON"),
    )
    .expect("Error writing file");
}

pub fn check_json_exists(path: &Path) -> bool {
    path.exists()
}
