pub mod handlers {    
    pub mod download_handler;
    pub mod config_handler;
    pub mod json_handler;
    pub mod http_handler;
    pub mod image_handler;
    pub mod custom_config;
    pub mod overlay_handler;
    pub mod obs_handler;
    pub mod os_handler;
}

pub mod constants;
pub mod thread_data;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use handlers::download_handler;
    use handlers::config_handler;
    use handlers::json_handler;
    use handlers::http_handler;
    use handlers::image_handler;
    use handlers::custom_config;
    use handlers::overlay_handler;
    use handlers::obs_handler;
    use constants;
    
    constants::setup();
    http_handler::setup();
    custom_config::search_overlay();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            download_handler::download_and_extract,
            config_handler::reset_overlays,
            json_handler::read_overlay_json,
            json_handler::read_config_json,
            json_handler::write_json,
            json_handler::reset_config,
            json_handler::get_name_map,
            json_handler::get_launch_json,
            json_handler::get_versions,
            json_handler::get_local_versions,
            json_handler::get_app_version,
            http_handler::run_server,
            http_handler::stop_server,
            constants::get_overlay_json_path,
            constants::get_config_json_path,
            constants::get_code_dir,
            constants::get_code_dir_image_path,
            image_handler::get_image_bytes,
            image_handler::copy_image,
            image_handler::get_image_vec_bytes,
            custom_config::setup_custom_config,
            overlay_handler::get_overlays_list,
            overlay_handler::download_selected_overlay,
            overlay_handler::delete_selected_overlay,
            overlay_handler::setup_overlays,
            obs_handler::inject,
            obs_handler::get_scene_collection,
            obs_handler::get_scenes,
            obs_handler::get_ws_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}