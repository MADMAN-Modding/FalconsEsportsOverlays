use std::fs;

use serde_json::Value;

use crate::constants;

#[tauri::command]
pub fn read_overlay_json(key : &str) -> Value {
    let json_data: Value = open_json(constants::get_overlay_json_path());

    json_data[key].clone()
}

fn open_json(path: String) -> Value {
    let json_data: Value = {
        let file_content: String = fs::read_to_string(path).expect("Error reading file");
        serde_json::from_str::<Value>(&file_content).expect("Error serializing to JSON")
    };

    // Prints the entire JSON, mainly for debugging 
    // println!("{:?}", serde_json::to_string_pretty(&json_data).expect("Error parsing to JSON"));

    // Returns the json data
    json_data
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

    json_data[json_key] = serde_json::Value::String(value);

    fs::write(path, serde_json::to_string_pretty(&json_data).expect("Error serializing to JSON")).expect("Error writing file");
}