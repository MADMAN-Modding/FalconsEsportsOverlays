use std::fs;

#[tauri::command]
fn open_json() {
    let file = fs::File::open("text.json")
        .expect("file should open read only");
    let json: serde_json::Value = serde_json::from_reader(file)
        .expect("file should be proper JSON");
    let first_name = json.get("FirstName")
        .expect("file should have FirstName key");   

    println!("{}", first_name);
}

#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JavaScript!");
}