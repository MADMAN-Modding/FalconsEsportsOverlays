
use users::get_current_username;

use super::json_handler;

pub fn inject(profile: &str, scene: &str) {
    let path = format!("{}{}.json", get_scene_path(), profile);

    println!("{}", path);

    let json = json_handler::read_json("sources", path);
    
    println!("{}", json);
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

pub fn get_scenes() -> Result<Vec<String>, String> {
    let path = get_scene_path();

    let mut scenes: Vec<String> = Vec::new();

    for scene in std::fs::read_dir(path).map_err(|e| e.to_string())? {
        let scene = scene.map_err(|e| e.to_string())?;

        if scene.file_type().unwrap().is_dir() {
            scenes.push(scene.file_name().into_string().unwrap());
        }
    }

    Ok(scenes)
}

fn get_os() -> String {
    std::env::consts::OS.to_string()
}

fn get_user() -> String {
    let username = get_current_username();
    
    username.unwrap().to_str().unwrap().to_string()
}

fn get_profile_path() -> String {
    match get_os().as_str() {
       "linux" => format!("/home/{}/.var/app/com.obsproject.Studio/config/obs-studio/basic/profiles/", get_user()),
        _ => "".to_string()
    }
}

fn get_scene_path() -> String {
    match get_os().as_str() {
        "linux" => format!("/home/{}/.var/app/com.obsproject.Studio/config/obs-studio/basic/scenes/", get_user()),
        _ => "".to_string()
    }
} 