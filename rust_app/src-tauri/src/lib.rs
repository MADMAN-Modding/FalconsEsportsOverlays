pub mod handlers {    
    pub mod download_handler;
    pub mod json_handler;
    pub mod http_handler;
}

pub mod constants;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use handlers::download_handler;
    use handlers::json_handler;
    use handlers::http_handler;
    use constants;
    
    constants::setup();
    http_handler::setup();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            download_handler::download_and_extract,
            download_handler::reset_overlays,
            json_handler::read_overlay_json,
            json_handler::write_json,
            http_handler::run_server,
            http_handler::stop_server,
            constants::get_overlay_json_path,
            constants::get_code_dir_image_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}