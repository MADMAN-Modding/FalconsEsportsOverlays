use crate::constants;

#[tauri::command]
pub fn get_overlays_list() -> Vec<String> {
    return find_overlays();
}

fn find_overlays() -> Vec<String> {
    let mut overlays: Vec<String> = Vec::new();

    // Loop through the directory and check if there is a .html file
    for entry in std::fs::read_dir(format!("{}/overlays", constants::get_code_dir())).unwrap() {
        let entry = entry.unwrap();
        
        // If the path is a file and it has a .html file, it will write the path to the config file
        if entry.path().is_file() {
            overlays.push(entry.file_name().into_string().unwrap().replace(".html", "").into());
        }
    }

    overlays.sort();

    overlays
}