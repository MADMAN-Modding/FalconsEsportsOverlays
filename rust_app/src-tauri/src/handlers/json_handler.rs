use std::fs;

use serde_json::Value;

use crate::constants;

#[tauri::command]
pub fn read_overlay_json(key : &str) -> Value {
    let json_data: Value = open_json(constants::get_overlay_json_path());

    json_data[key].clone()
}

pub fn open_json(path: String) -> Value{
    let json_data = {
        let file_content = fs::read_to_string(path).expect("Error reading file");
        serde_json::from_str::<Value>(&file_content).expect("Error serializing to JSON")
    };

    // Prints the entire JSON, mainly for debugging 
    // println!("{:?}", serde_json::to_string_pretty(&json_data).expect("Error parsing to JSON"));

    // Returns the json data
    json_data
}