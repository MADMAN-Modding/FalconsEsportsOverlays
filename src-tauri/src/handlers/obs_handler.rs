
use std::{fs, path::Path};

use serde_json::{json, Value};
use whoami::fallible::username;

use crate::handlers::json_handler::{get_json_length, iterate_json, read_json_as_value, write_nested_json_no_io};

#[tauri::command]
pub fn inject(scene: &str) -> String {
    let scenes = get_scenes();

    if scenes.is_ok() {
        if !scenes.unwrap().iter().any(|s| s == scene) {
            return "Scene not Found".to_string();
        }
    }

    let path = format!("{}{}.json", get_scene_path(), scene);

    let json = read_json_as_value(path.clone());
    
    let items = json["sources"][0]["settings"]["items"].clone();

    let sources = json["sources"].clone();

    let entries = iterate_json("name", &items);

    let has_browser : bool;

    has_browser = entries.iter().any(|entry| entry.replace("\"", "") == "Falcons Esports Overlays Browser");

    if !has_browser {
        let item_count = get_json_length(&items);

        let json = write_nested_json_no_io(json, format!("sources.[0]settings.items.[{}]", item_count + 1), get_obs_browser_source());

        let source_count = get_json_length(&sources);

        let json = write_nested_json_no_io(json, format!("sources.[{}]", source_count + 1), get_obs_browser_config());

        let _ = fs::write(Path::new(&path), serde_json::to_string_pretty(&json).expect("Error Serializing JSON"));
        
        return format!("Scene {} injected", scene);
    }

    format!("Scene {} already injected", scene)
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
pub fn get_scenes() -> Result<Vec<String>, String> {
    let path = get_scene_path();

    let mut scenes: Vec<String> = Vec::new();

    for scene in std::fs::read_dir(path).map_err(|e| e.to_string())? {
        let scene = scene.map_err(|e| e.to_string())?;

        let length = scene.file_name().len();

        let file_type = scene.file_name().into_string().unwrap().get(length-5..length).unwrap().to_owned();

        if file_type == ".json" {
            let file_name = scene.file_name().into_string().unwrap();
            scenes.push(file_name.get(0..file_name.len()-5).unwrap().to_string());
        }
    }

    Ok(scenes)
}

fn get_os() -> String {
    std::env::consts::OS.to_string()
}

fn get_username() -> String {
    let username = username();
    
    username.unwrap()
}

fn get_profile_path() -> String {
    let username = get_username();

    match get_os().as_str() {
       "linux" => format!("/home/{username}/.var/app/com.obsproject.Studio/config/obs-studio/basic/profiles/"),
       "windows" => format!("C:/Users/{username}/AppData/Roaming/obs-studio/basic/profiles/"),
        _ => "".to_string()
    }
}

fn get_scene_path() -> String {
    let username = get_username();

    match get_os().as_str() {
        "linux" => format!("/home/{username}/.var/app/com.obsproject.Studio/config/obs-studio/basic/scenes/"),
        "windows" => format!("C:/Users/{username}/AppData/Roaming/obs-studio/basic/scenes/"),
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
