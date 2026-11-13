//! This module is used for read and writing the json data used for the overlays and the app
use std::{
    collections::HashMap,
    fs,
    path::Path,
    sync::Mutex,
};

use serde_json::{json, Value};

use crate::constants::{self, get_launch_json_path, get_local_versions_path, DATA_BASE_URL};

use super::download_handler::download_bytes;

/// Serializes read-modify-write cycles so concurrent updates can't overwrite each other
static WRITE_LOCK: Mutex<()> = Mutex::new(());

fn lock_writes() -> std::sync::MutexGuard<'static, ()> {
    WRITE_LOCK.lock().unwrap_or_else(|e| e.into_inner())
}

/// Writes a JSON file by replacing it in one step, so readers never see a half-written file
pub fn write_json_file(path: &str, value: &Value) -> Result<(), String> {
    let contents = serde_json::to_string_pretty(value).map_err(|e| e.to_string())?;
    let temp_path = format!("{}.tmp", path);

    fs::write(&temp_path, contents).map_err(|e| format!("Error writing file: {}", e))?;
    fs::rename(&temp_path, path).map_err(|e| format!("Error writing file: {}", e))
}

/// Reads the overlay json and returns the value of the requested key
///
/// # Parameters
/// * `key: &str` - The key to be read from the json file
///
/// # Returns
/// * `Result<Value, String>` - The data at the desired key or an error
#[tauri::command]
pub fn read_overlay_json(key: &str) -> Result<Value, Value> {
    read_json_value(key, &constants::get_overlay_json_path())
}

/// Reads the config json and returns the value of the requested key
///
/// # Parameters
/// * `key: &str` - The key to be read from the json file
///
/// # Returns
/// * `Result<Value, String>` - The data at the desired key or an error
#[tauri::command]
pub fn read_config_json(key: &str) -> Result<Value, Value> {
    read_json_value(key, &constants::get_config_json_path())
}

/// Reads the custom json and returns the value of the requested key
///
/// # Parameters
/// * `key: &str` - The key to be read from the json file
///
/// # Returns
/// * `Result<Value, String>` - The data at the desired key or an error
#[tauri::command]
pub fn read_custom_json(key: &str) -> Result<Value, Value> {
    read_json_value(key, &constants::get_custom_config_path())
}

/// Reads the json at the supplied path and returns the value of the requested key
///
/// # Parameters
/// * `key: &str` - The key to be read from the json file
/// * `path: &str` - The path to the json file
///
/// # Returns
/// * `Result<Value, Value>` - The data at the desired key or an error
fn read_json_value(key: &str, path: &str) -> Result<Value, Value> {
    let path_obj = Path::new(path);

    if path_obj.exists() {
        let json_data = open_json(path);

        if let Some(value) = json_data.get(key) {
            Ok(value.clone())
        } else {
            Err(Value::from(format!("Key '{}' not found in JSON", key)))
        }
    } else {
        if !path.contains("overlay.json")
            && !path.contains("config.json")
            && !path.contains("launch.json")
        {
            return Err(Value::from(format!("File not found: {}", path)));
        } else {
            // If the file doesn't exist, initialize it and then try to read the value again
            let _ = init_json(path);
            read_json_value(key, path)
        }
    }
}

/// Legacy string-based read for backward compatibility (deprecated)
#[tauri::command]
pub fn read_json(key: &str, path: String) -> String {
    let path_obj = Path::new(&path);

    if path_obj.exists() {
        let json_data = open_json(path_obj.to_str().unwrap());
        json_data[key].to_string().replace("\"", "")
    } else {
        "{}".to_string()
    }
}

/// Internal helper: Read config JSON as string (for backward compatibility with internal code)
pub fn read_config_json_string(key: &str) -> String {
    read_json_value(key, &constants::get_config_json_path())
        .and_then(|v| match v {
            Value::String(s) => Ok(s),
            Value::Bool(b) => Ok(b.to_string()),
            Value::Number(n) => Ok(n.to_string()),
            _ => Ok(v.to_string().replace("\"", "")),
        })
        .unwrap_or_else(|_| get_default_json_data()[key].to_string().replace("\"", ""))
}

/// Internal helper: Read custom JSON as string (for backward compatibility with internal code)
pub fn read_custom_json_string(key: &str) -> String {
    read_json_value(key, &constants::get_custom_config_path())
        .and_then(|v| match v {
            Value::String(s) => Ok(s),
            Value::Bool(b) => Ok(b.to_string()),
            Value::Number(n) => Ok(n.to_string()),
            _ => Ok(v.to_string().replace("\"", "")),
        })
        .unwrap_or_else(|_| "null".to_string())
}

/// Internal helper: Read overlay JSON as string (for backward compatibility with internal code)
pub fn read_overlay_json_string(key: &str) -> String {
    read_json_value(key, &constants::get_overlay_json_path())
        .and_then(|v| match v {
            Value::String(s) => Ok(s),
            Value::Bool(b) => Ok(b.to_string()),
            Value::Number(n) => Ok(n.to_string()),
            _ => Ok(v.to_string().replace("\"", "")),
        })
        .unwrap_or_else(|_| "null".to_string())
}

pub fn read_json_as_value(path: &str) -> Value {
    open_json(path)
}

/// Opens the json file with the supplied path
///
/// # Parameters
/// * `path: String` - The path to the JSON file to read
///
/// # Returns
/// * `Value` - Contains the JSON data
///
/// # Examples
/// ```ignore
/// open_json("random_path/overlay.json");
/// ```
fn open_json(path: &str) -> Value {
    let json_data: Value;

    // Checks to make sure that the JSON file is there, if it isn't it makes it
    if Path::new(&path).exists() {
        let file_content: String = fs::read_to_string(&path).expect("File not found");

        // If the file is a "Resource Not Found" file, return a blank vector
        if file_content.is_empty() {
            return Value::default();
        }

        json_data =
            serde_json::from_str::<Value>(&file_content).expect("Error serializing to JSON");
    } else {
        json_data = init_json(path);
    }

    // Returns the json data
    json_data
}

/// This function is called if the JSON being read doesn't exist
///
/// It after making the file it will try to read the file and then return that value
///
/// # Parameters
/// * `path: String` - The path to the JSON file to read
///
/// # Returns
/// * `Value` - Contains the JSON data
pub fn init_json(path: &str) -> Value {
    // Creating the directories
    let _ = std::fs::create_dir_all(Path::new(&path).parent().unwrap());

    // Initializes the json_data variable
    let json_data: Value;

    if path.contains("overlay.json") {
        json_data = default_overlay_json();
    } else if path.contains("config.json") {
        json_data = get_default_json_data();
    } else if path.contains("launch.json") {
        json_data = json!({"overlays" : []});
    } else {
        json_data = json!({});
    }

    // Creating the JSON file
    write_json_file(path, &json_data).expect("Error writing file");

    // Trying to open the JSON again
    open_json(path)
}

/// The overlay settings a fresh install starts with
pub fn default_overlay_json() -> Value {
    json!({
        "teamNameLeft": "DC Falcons Red",
        "teamNameRight": "That other team",
        "winsLeft": "0",
        "winsRight": "0",
        "teamColorLeft": "#BE0F32",
        "teamColorRight": "#0120AC",
        "overlay": "kart",
        "week": "0",
        "scoreLeft": "0",
        "scoreRight": "0",
        "playerNamesLeft": "MADMAN-Modding",
        "playerNamesRight": "Check out my Github"
    })
}

/// The default value of a config key as a string
pub fn default_config_value(key: &str) -> String {
    get_default_json_data()[key]
        .as_str()
        .unwrap_or_default()
        .to_string()
}

/// Writes to the JSON file at the supplied path
///
/// # Parameters
/// * `path: String` - Path to the JSON file
/// * `json_key: String` - Key to write to
/// * `value: Value` - Value to write to the key (properly typed)
///
/// # Returns
/// * `Result<(), String>` - Success or error message
#[tauri::command]
pub fn write_json_value(path: String, json_key: String, value: Value) -> Result<(), String> {
    let _guard = lock_writes();
    let mut json_data = open_json(&path);

    json_data[json_key] = value;

    write_json_file(&path, &json_data)
}

/// Writes several keys to the JSON file at the supplied path with a single read and write
///
/// # Parameters
/// * `path: String` - Path to the JSON file
/// * `values: HashMap<String, Value>` - Keys and the values to write to them
///
/// # Returns
/// * `Result<(), String>` - Success or error message
#[tauri::command]
pub fn write_json_values(path: String, values: HashMap<String, Value>) -> Result<(), String> {
    let _guard = lock_writes();
    let mut json_data = open_json(&path);

    for (key, value) in values {
        json_data[key] = value;
    }

    write_json_file(&path, &json_data)
}

/// Writes to the JSON file at the supplied path (legacy string-based, for backward compatibility)
///
/// # Parameters
/// * `path: String` - Path to the JSON file
/// * `json_key: String` - Key to write to
/// * `value: String` - Value to write to the key
///
/// # Examples
/// ```ignore
/// write_json("random_path/overlay.json", "overlay", "kart");
/// ```
#[tauri::command]
pub fn write_json(path: String, json_key: String, mut value: String) {
    let _guard = lock_writes();
    let mut json_data = open_json(&path);

    // Writes a bool if the json_key is a checked value which must be a bool
    if value == "true" || value == "false" {
        let bool_value = match value.to_lowercase().as_str() {
            "true" => true,
            "false" => false,
            _ => false,
        };

        json_data[json_key] = serde_json::Value::Bool(bool_value);
    // Writes an int to the json if the value contains "version"
    } else if value.contains("version") {
        // Get the version number from the value
        let sub_string: &str = value.split_at(7).1;
        // Read the version number to a float
        let float_value: f64 = sub_string.parse().unwrap();
        // Truncate any decimals
        let int_value = float_value as i16;

        // Updates the json variable with the int_value at the current key
        json_data[json_key] = serde_json::Value::Number(int_value.into());
    } else {
        value = value.replace("\"", "");

        json_data[json_key] = serde_json::Value::String(value);
    }

    write_json_file(&path, &json_data).expect("Error writing file");
}

/// Recursively reads a JSON value and writes a new value to the specified key path.
/// No IO means it won't write to file system
///
/// # Parameters
/// * `json` - The JSON value to be modified.
/// * `keys` - A dot-separated string path specifying the keys/indexes to traverse. Array indices should be wrapped in square brackets, `arrayKey[0].nestedKey`.
/// * `value` - The new value to write at the final key.
///
/// # Returns
/// * `Value` - The modified JSON with the new value inserted.
///
/// # Example
/// ```ignore
/// use serde_json::{json, Value};
///
/// let json = json!({"key": [{"nestedKey": "oldValue"}]});
///
/// let value = Value::String("newValue".to_string());
///
/// let new_json = write_nested_json_no_io(json, "key[0].nestedKey".to_string(), value);
///
/// assert_eq!(new_json, json!({"key": [{"nestedKey": "newValue"}]}));
/// ```
pub fn write_nested_json_no_io(mut json: Value, keys: String, value: Value) -> Value {
    // Makes the key variable to keep track of characters
    let mut key = String::new();

    // Iterates through every char while keeping track of the index
    for (i, char) in keys.chars().enumerate() {
        match char {
            // If char is a '.', set json[key] equal to the next nested key
            '.' => {
                json[key] = write_nested_json_no_io(
                    json[&key].clone(),
                    keys.clone().split_at(i + 1).1.to_owned(),
                    value,
                );
                break;
            }
            // If char is a '['
            '[' => {
                // Get the char from the string as a usize
                let mut key = String::new();

                for char in keys.get(i..).unwrap().chars() {
                    if char != ']' {
                        key.push(char);
                    } else if char == ']' {
                        break;
                    }
                }

                let i_key = keys.get(i + 1..i + 2).unwrap().parse::<usize>().unwrap();

                // If the key doesn't exist, push the value and set the json equal to the new Vec
                if json.as_array().unwrap().len() == 0 || json.as_array().unwrap().len() - 1 < i_key
                {
                    let mut json_vec = json.as_array().unwrap().to_owned();

                    json_vec.push(value);

                    json = Value::Array(json_vec);
                } else {
                    // If the key exists, set it equal to the next nested value
                    json[i_key] = write_nested_json_no_io(
                        json[i_key].clone(),
                        keys.clone().split_at(i + 3).1.to_owned(),
                        value,
                    );
                }

                // Escape the loop
                break;
            }
            // If char is a ']' do nothing
            ']' => (),
            // If char is anything else, add it to the key
            _ => key.push(char),
        }

        // If i is the last character, or if the next character is ']' and i is the second to last character
        // Write the inputted value to the json
        if i == keys.len() - 1
            || (keys.get(i..i + 1).unwrap() == "]".to_string() && i == keys.len() - 2)
        {
            json[key.clone()] = value.clone();
        }
    }

    // Returns the json object
    json
}

pub fn write_config(json_key: String, value: &str) {
    write_json(
        constants::get_config_json_path(),
        json_key,
        value.to_string(),
    );
}

/// Iterate over a json object and return a Vec of key values
///
/// # Parameters
/// * `json_key : &str` - Key to search for
/// * `json : &Value` - Reference to json object to be search
///
/// # Returns
/// 'Vec<String>' Contains all the found values
pub fn iterate_json(json_key: &str, json: &Value) -> Vec<String> {
    let mut entries: Vec<String> = Vec::new();

    if json.is_array() {
        for value in json.as_array().unwrap().to_vec() {
            for v in iterate_json_map(json_key, &value) {
                entries.push(v);
            }
        }
    } else {
        for v in iterate_json_map(json_key, json) {
            entries.push(v);
        }
    }

    entries
}

/// Iterates over a json object
///
/// # Parameters
/// * `json_key` : &str` - Key to search for
/// * `json : &Value` - Reference to json object to be searched
///
/// # Returns
/// `Vec<String>` Contains all the found values
fn iterate_json_map(json_key: &str, json: &Value) -> Vec<String> {
    let mut entries: Vec<String> = Vec::new();

    if !json.is_object() {
        return Vec::new();
    }

    for value in json.as_object().unwrap() {
        let (key, v) = value;
        if key == json_key {
            entries.push(v.to_string().replace("\"", ""));
        } else if v.is_object() {
            for val in iterate_json(json_key, &v) {
                entries.push(val);
            }
        }
    }

    entries
}

/// Counts the length of a json object
///
/// # Parameters
/// * `json : &Value` - JSON to be searched
///
/// # Returns
/// * `u32` The length of the json
pub fn get_json_length(json: &Value) -> u32 {
    let mut size: u32 = 0;

    if json.is_array() {
        for v in json.as_array().unwrap().to_vec() {
            for _ in v.as_object().unwrap() {
                size += 1;
            }
        }
    } else {
        for _ in json.as_object().unwrap() {
            size += 1;
        }
    }

    size
}

/// Resets the config
#[tauri::command]
pub fn reset_config() {
    let default_json = get_default_json_data();
    for key in default_json.as_object().unwrap() {
        // If the key is a string, it will write the key and value to the config file
        let value = key.1.to_string().replace("\"", "");

        write_config(key.0.to_owned(), value.as_str());
    }
}

/// Downloads launch.json from the resource URL
///
/// The existing file is kept unless the download is valid JSON
#[tauri::command]
pub async fn get_launch_json() -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(|| {
        let bytes = download_bytes(&format!("{}/launch.json", DATA_BASE_URL))?;
        let json: Value =
            serde_json::from_slice(&bytes).map_err(|e| format!("Invalid launch.json: {}", e))?;

        let _guard = lock_writes();
        write_json_file(&get_launch_json_path(), &json)
    })
    .await
    .map_err(|e| format!("Download task failed: {}", e))?
}

/// Get all the available overlays
#[tauri::command]
pub fn get_name_map() -> Result<HashMap<String, Value>, String> {
    let json = open_json(&get_launch_json_path())["overlays"].clone();

    let object = json.as_object();

    if object.is_none() {
        return Err("Error Reading JSON".to_string());
    }

    Ok(object
        .unwrap()
        .clone()
        .into_iter()
        .map(|(k, v)| (k, v.clone()))
        .collect())
}

/// Get all the latest version for all the overlays
#[tauri::command]
pub fn get_versions() -> Result<HashMap<String, Value>, String> {
    let mut json = open_json(&get_launch_json_path())["versions"].clone();

    json.sort_all_objects();

    let object = json.as_object();

    if object.is_none() {
        return Err("Error Reading JSON".to_string());
    }

    Ok(object
        .unwrap()
        .clone()
        .into_iter()
        .map(|(k, v)| (k, v.clone()))
        .collect())
}

/// Get the list of all the overlays local versions
#[tauri::command]
pub fn get_local_versions() -> Result<HashMap<String, Value>, String> {
    let json = open_json(&get_local_versions_path());

    let object = json.as_object();

    if object.is_none() {
        return Err("Error Reading JSON".to_string());
    }

    Ok(object
        .unwrap()
        .clone()
        .into_iter()
        .map(|(k, v)| (k, v.clone()))
        .collect())
}

/// Gets the latest app version
#[tauri::command]
pub fn get_app_version() -> Result<HashMap<String, Value>, String> {
    let json = open_json(&get_launch_json_path())["appVersion"].clone();

    let object = json.as_object();

    if object.is_none() {
        return Err("Error Reading JSON".to_string());
    }

    Ok(object
        .unwrap()
        .clone()
        .into_iter()
        .map(|(k, v)| (k, v.clone()))
        .collect())
}

/// The message shown when an update is available
///
/// `updateText` and `updateUrl` are escaped before they're put in a link. Older data files
/// only have an HTML `updateMessage`, which is used when those aren't there.
#[tauri::command]
pub fn get_update_message() -> String {
    let json = open_json(&get_launch_json_path());
    let app = &json["appVersion"];

    if let (Some(text), Some(url)) = (app["updateText"].as_str(), app["updateUrl"].as_str()) {
        if url.starts_with("https://github.com/MADMAN-Modding/") {
            return format!(
                "<a style='color: black;' href='{}' target='_blank'>{}</a>",
                escape_html(url),
                escape_html(text)
            );
        }
    }

    app["updateMessage"]
        .as_str()
        .unwrap_or("A new version is available")
        .to_string()
}

fn escape_html(text: &str) -> String {
    text.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#39;")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn escapes_html_special_characters() {
        assert_eq!(
            escape_html("<a href='x'>&\"</a>"),
            "&lt;a href=&#39;x&#39;&gt;&amp;&quot;&lt;/a&gt;"
        );
    }
}

/// Default settings for the config
fn get_default_json_data() -> Value {
    json!({
        "appColor": "#bf0f35",
        "columnColor": "#ffffff",
        "overlayURL" : "https://codeload.github.com/MADMAN-Modding/FalconsEsportsOverlaysData/zip/refs/heads/main",
        "overlayDir": "FalconsEsportsOverlays-main",
        "ssbuChecked": true,
        "kartChecked": true,
        "overwatchChecked": true,
        "rocketLeagueChecked": true,
        "splatChecked": true,
        "valChecked": true,
        "hearthChecked": true,
        "lolChecked": true,
        "chessChecked": true,
        "maddenChecked": true,
        "nba2KChecked": true,
        "autoUpdate": false,
        "autoServer": false
    })
}
