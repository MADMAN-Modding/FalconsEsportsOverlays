async function read_overlay_json(key) {
    // Calls the read_overlay_json function from rust, passes the argument "key" with the value of key
    // Then takes the return value and prints it to the console
    await invoke('read_overlay_json', { "key" : key }).then((value) => console.log(value));
}

async function write_overlay_json(key, value) {
    // Makes the jsonPath variable
    let jsonPath;

    // Get the path
    await invoke('get_overlay_json_path').then((value) => jsonPath = value);

    // Update the data
    invoke('write_json', { "path" : jsonPath, "jsonKey" : key, "value" : value });
}