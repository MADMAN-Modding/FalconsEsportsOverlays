use std::process::Stdio;

use serde_json::{json, Value};

use crate::handlers::json_handler::{iterate_json, read_json_as_value};

use super::{
    json_handler::{read_json, write_json},
    os_handler::{get_os, get_process_status, get_username, kill_process},
};

#[tauri::command]
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
pub fn get_scenes(collection: String) -> Vec<String> {
    let path = format!("{}{}.json", get_scene_path(), collection);

    let json = read_json_as_value(path);

    let scenes = iterate_json("name", &json["scene_order"]);

    scenes
}

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

fn enable_ws() {
    let path = get_ws_path();

    write_json(path, "server_enabled".to_string(), "true".to_string());
}

fn get_ws_status() -> bool {
    let path = get_ws_path();

    read_json_as_value(path)["server_enabled"]
        .as_bool()
        .unwrap()
}

#[tauri::command]
pub fn get_ws_password() -> String {
    let path = get_ws_path();

    read_json("server_password", path)
}

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

fn get_ws_path() -> String {
    let username = get_username();

    match get_os().as_str() {
        "linux" => format!("/home/{username}/.var/app/com.obsproject.Studio/config/obs-studio/plugin_config/obs-websocket/config.json"),
        "windows" => format!("C:/Users/{username}/AppData/Roaming/obs-studio/plugin_config/obs-websocket/config.json"),
        _ => "".to_string()
    }
}

pub fn get_obs_browser_source() -> Value {
    json!({
        "name": "Falcons Esports Overlays Browser",
        "source_uuid": "818eaee2-1c91-41be-91ff-9dc1a504a21a",
        "visible": true,
        "locked": false,
        "rot": 0.0,
        "scale_ref": {
            "x": 1920.0,
            "y": 1080.0
        },
        "align": 5,
        "bounds_type": 0,
        "bounds_align": 0,
        "bounds_crop": false,
        "crop_left": 0,
        "crop_top": 0,
        "crop_right": 0,
        "crop_bottom": 0,
        "id": 3,
        "group_item_backup": false,
        "pos": {
            "x": 0.0,
            "y": 0.0
        },
        "pos_rel": {
            "x": -1.7777777910232544,
            "y": -1.0
        },
        "scale": {
            "x": 1.0,
            "y": 1.0
        },
        "scale_rel": {
            "x": 1.0,
            "y": 1.0
        },
        "bounds": {
            "x": 0.0,
            "y": 0.0
        },
        "bounds_rel": {
            "x": 0.0,
            "y": 0.0
        },
        "scale_filter": "disable",
        "blend_method": "default",
        "blend_type": "normal",
        "show_transition": {
            "duration": 0
        },
        "hide_transition": {
            "duration": 0
        },
        "private_settings": {}
    }

    )
}

pub fn get_obs_browser_config() -> Value {
    json!({
        "prev_ver": 520093699,
        "name": "Falcons Esports Overlays Browser",
        "uuid": "818eaee2-1c91-41be-91ff-9dc1a504a21a",
        "id": "browser_source",
        "versioned_id": "browser_source",
        "settings": {
            "width": 1920,
            "height": 1080,
            "url": "http://localhost:8080",
            "fps": 60,
            "css": ""
        },
        "mixers": 255,
        "sync": 0,
        "flags": 0,
        "volume": 1.0,
        "balance": 0.5,
        "enabled": true,
        "muted": false,
        "push-to-mute": false,
        "push-to-mute-delay": 0,
        "push-to-talk": false,
        "push-to-talk-delay": 0,
        "hotkeys": {
            "libobs.mute": [],
            "libobs.unmute": [],
            "libobs.push-to-mute": [],
            "libobs.push-to-talk": [],
            "ObsBrowser.Refresh": []
        },
        "deinterlace_mode": 0,
        "deinterlace_field_order": 0,
        "monitoring_type": 0,
        "private_settings": {}
    })
}
