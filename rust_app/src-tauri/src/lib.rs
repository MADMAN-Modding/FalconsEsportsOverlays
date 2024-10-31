include!("handlers/json_handler.rs");
include!("handlers/download_handler.rs");
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        // .invoke_handler(tauri::generate_handler![my_custom_command])
        .invoke_handler(tauri::generate_handler![open_json])
        .invoke_handler(tauri::generate_handler![download_and_extract])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}