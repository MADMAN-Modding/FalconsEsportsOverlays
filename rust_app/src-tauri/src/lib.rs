// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub mod handlers {    
    pub mod download_handler;
    pub mod json_handler;
}

pub mod constants;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use handlers::download_handler::download_and_extract;
    use handlers::download_handler::hi;
    use handlers::json_handler::open_json;
    use constants;
    
    constants::setup();


    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            download_and_extract,
            greet,
            open_json,
            hi])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}