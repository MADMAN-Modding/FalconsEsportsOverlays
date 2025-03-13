use directories::ProjectDirs;
use once_cell::sync::OnceCell;

use crate::handlers::json_handler::read_config_json;

static PROJ_DIRS: OnceCell<ProjectDirs> = OnceCell::new();

pub fn setup() {
    PROJ_DIRS
        .set(
            ProjectDirs::from(
                "com",
                "MADMAN-Modding",
                "Falcons Esports Overlays Controller",
            )
            .expect("Failed to create ProjectDirs"),
        )
        .unwrap();

    let _ = std::fs::create_dir_all(
        PROJ_DIRS
            .get()
            .expect("Failed to make config dir")
            .config_dir(),
    );
}

pub fn get_config_dir() -> String {
    let proj_dir = PROJ_DIRS.get().expect("ProjectDirs in not initialized :(");

    proj_dir.config_dir();

    let config_dir = ProjectDirs::config_dir(&proj_dir).to_str().unwrap();

    return config_dir.to_string();
}

#[tauri::command]
pub fn get_code_dir() -> String {
    format!("{}/{}", get_config_dir(), read_config_json("overlay_dir"))
}

#[tauri::command]
pub fn get_overlay_json_path() -> String {
    format!("{}/json/overlay.json", get_code_dir())
}

pub fn get_config_dir_overlay_json_path() -> String {
    format!("{}/overlay.json", get_config_dir()).to_owned()
}

#[tauri::command]
pub fn get_config_json_path() -> String {
    format!("{}/config.json", get_config_dir())
}

pub fn get_config_dir_image_path() -> String {
    format!("{}/Esports-Logo.png", get_config_dir())
}

#[tauri::command]
pub fn get_code_dir_image_path() -> String {
    format!("{}/images/Esports-Logo.png", get_code_dir())
}

pub fn get_custom_config_path() -> String {
    format!("{}/custom_config.json", get_config_dir())
}

pub fn get_launch_json_path() -> String {
    format!("{}/launch.json", get_code_dir())
}

pub fn get_overlays_path() -> String {
    format!("{}/overlays", get_code_dir())
}