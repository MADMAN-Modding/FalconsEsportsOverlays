use std::fs;

use serde_json::{Result, Value};



#[tauri::command]
fn open_json() {
    let file_path = "data/test.json".to_owned();
    let contents = fs::read_to_string(file_path).expect("Couldn't find or load that file.");
}

#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JavaScript!");
}