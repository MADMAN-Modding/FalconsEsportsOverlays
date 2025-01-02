async function read_overlay_json(key) {
    // Calls the read_overlay_json function from rust, passes the argument "key" with the value of key
    // Then takes the return value and prints it to the console
    await invoke('read_overlay_json', { "key" : key }).then((value) => console.log(value));
}

async function write_overlay_json(key, value) {
    // Gets the json path
    let jsonPath = await invoke('get_overlay_json_path');

    // Update the data
    invoke('write_json', { "path": jsonPath, "jsonKey": key, "value": value });
}

async function read_config_json(key) {
    // Calls the read_config_json function from rust, passes the argument "key" with the value of key
    // Then takes the return value and prints it to the console
    let value = await invoke('read_config_json', { "key" : key }).then((value) => overlay = Array.from(value).filter(char => char !== "\"").join(''));

    return value;
}

async function write_config_json(key, value) {
    // Gets the json path
    let jsonPath = await invoke('get_config_json_path');

    // Update the data
    invoke('write_json', { "path": jsonPath, "jsonKey": key, "value": value });
}