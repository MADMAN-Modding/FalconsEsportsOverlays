use std::fs;

#[tauri::command]
pub fn open_json() -> String {
    let file_path = "data/test.json".to_owned();
    let contents = fs::read_to_string(file_path).expect("Couldn't find or load that file.");

    "Hi!".to_string()
}