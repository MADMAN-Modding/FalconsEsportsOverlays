use std::process::Stdio;

use crate::handlers::json_handler::{iterate_json, read_json_as_value};

use super::{
    json_handler::{read_json, write_json},
    os_handler::{get_os, get_process_status, get_username, kill_process},
};

#[tauri::command]
/// Adds the source to OBS
pub fn inject() {
    // If the web socket is set to false
    let mut process_running = get_process_status("obs");
    if !get_ws_status() {

        if process_running {
            kill_process("obs");
        }

        enable_ws();
    }
    
    if !process_running {
        start_obs();
    }

    while !process_running {
        process_running = get_process_status("obs");
    }
}

/// Returns all the profiles
pub fn get_profiles() -> Result<Vec<String>, String> {
    let path = get_profile_path();

    let mut profiles: Vec<String> = Vec::new();

    for folder in std::fs::read_dir(path).map_err(|e| e.to_string())? {
        let folder = folder.map_err(|e| e.to_string())?;

        if folder.file_type().unwrap().is_dir() {
            profiles.push(folder.file_name().into_string().unwrap());
        }
    }

    Ok(profiles)
}

#[tauri::command]
/// Returns the name of the scene collections
pub fn get_scene_collection() -> Result<Vec<String>, String> {
    let path = get_scene_path();

    let mut scenes: Vec<String> = Vec::new();

    for scene in std::fs::read_dir(path).map_err(|e| e.to_string())? {
        let scene = scene.map_err(|e| e.to_string())?;

        let length = scene.file_name().len();

        let file_type = scene
            .file_name()
            .into_string()
            .unwrap()
            .get(length - 5..length)
            .unwrap()
            .to_owned();

        if file_type == ".json" {
            let file_name = scene.file_name().into_string().unwrap();
            scenes.push(file_name.get(0..file_name.len() - 5).unwrap().to_string());
        }
    }

    Ok(scenes)
}

#[tauri::command]
/// Returns all the available scenes for a scene collection
pub fn get_scenes(collection: String) -> Vec<String> {
    let path = format!("{}{}.json", get_scene_path(), collection);

    let json = read_json_as_value(path);

    let scenes = iterate_json("name", &json["scene_order"]);

    scenes
}

/// Starts obs in the background
/// Skips the check to see if it was force closed
fn start_obs() {
    use std::process::Command;

    let os = get_os();

    match os.as_str() {
        "windows" => {
            // Use "start" to launch the process in the background on Windows
            let _ = Command::new("cmd")
                .args([
                    "/C",
                    "start",
                    "obs64.exe",
                    "--disable-shutdown-check",
                ])
                .stdout(Stdio::null()) // Redirect output to prevent blocking
                .stderr(Stdio::null()) // Redirect error output to prevent blocking
                .spawn() // Use spawn to run asynchronously
                .expect("Failed to start OBS on Windows");
        }
        "linux" => {
            // Use "bash -c" and "&" to run in the background on Linux (Flatpak)
            let _ = Command::new("bash")
            .args([
                "-c", 
                "flatpak run com.obsproject.Studio --disable-shutdown-check &"
            ])
            .stdout(Stdio::null())  // Redirect output to prevent blocking
            .stderr(Stdio::null())  // Redirect error output to prevent blocking
            .spawn()                // Use spawn to run asynchronously
            .expect("Failed to start OBS Flatpak on Linux in background");
        }
        "macos" => {
            // Use "bash -c" and "&" to run in the background on macOS
            let _ = Command::new("bash")
                .args([
                    "-c",
                    "open -a OBS --args --disable-shutdown-check &",
                ])
                .stdout(Stdio::null()) // Redirect output to prevent blocking
                .stderr(Stdio::null()) // Redirect error output to prevent blocking
                .spawn() // Use spawn to run asynchronously
                .expect("Failed to start OBS on macOS in background");
        }
        _ => {
            eprintln!("Unsupported OS: {}", os);
        }
    }
}

/// Enables the websocket in the json
fn enable_ws() {
    let path = get_ws_path();

    write_json(path, "server_enabled".to_string(), "true".to_string());
}

/// Is the websocket enabled?
fn get_ws_status() -> bool {
    let path = get_ws_path();

    read_json_as_value(path)["server_enabled"]
        .as_bool()
        .unwrap()
}

#[tauri::command]
/// Gets the password of the websocket
pub fn get_ws_password() -> String {
    let path = get_ws_path();

    read_json("server_password", path)
}

/// Path to the profiles
fn get_profile_path() -> String {
    let username = get_username();

    match get_os().as_str() {
        "linux" => format!(
            "/home/{username}/.var/app/com.obsproject.Studio/config/obs-studio/basic/profiles/"
        ),
        "windows" => format!("C:/Users/{username}/AppData/Roaming/obs-studio/basic/profiles/"),
        _ => "".to_string(),
    }
}

/// Path to the scenes
fn get_scene_path() -> String {
    let username = get_username();

    match get_os().as_str() {
        "linux" => format!(
            "/home/{username}/.var/app/com.obsproject.Studio/config/obs-studio/basic/scenes/"
        ),
        "windows" => format!("C:/Users/{username}/AppData/Roaming/obs-studio/basic/scenes/"),
        _ => "".to_string(),
    }
}

/// Path to the websocket json
fn get_ws_path() -> String {
    let username = get_username();

    match get_os().as_str() {
        "linux" => format!("/home/{username}/.var/app/com.obsproject.Studio/config/obs-studio/plugin_config/obs-websocket/config.json"),
        "windows" => format!("C:/Users/{username}/AppData/Roaming/obs-studio/plugin_config/obs-websocket/config.json"),
        _ => "".to_string()
    }
}