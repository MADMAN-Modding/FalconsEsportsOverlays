/**
 * Calls the readOverlayJSON function from rust, passes the argument `key` with the value of key
 * @param {String} key
 * @returns {Promise<String>} 
 * @async
*/
async function readOverlayJSON(key) {
    let value = await invoke('read_overlay_json', { "key" : key });
        
    return value;
}

/**
 * Writes to the `overlay.json` file in the code directory
 * @param {String} key
 * @param {String} value 
 * @returns {void}
 * @async
 */
async function writeOverlayJSON(key, value) {
    // Gets the json path
    let jsonPath = await invoke('get_overlay_json_path');

    // Update the data
    invoke('write_json', { "path": jsonPath, "jsonKey": key, "value": value });
}

/**
 * Calls the readConfigJSON function from rust, passes the argument "key" with the value of key
 * @param {String} key 
 * @returns {Promise<String>}
 * @async
 */
async function readConfigJSON(key) {
    let value = await invoke('read_config_json', { "key" : key });

    return value;
}

/**
 * Writes to the config.json file in the config directory
 * @param {String} key 
 * @param {String} value 
 * @returns {void}
 * @async
 */
async function writeConfigJSON(key, value) {
    // Gets the json path
    let jsonPath = await invoke('get_config_json_path');

    // Update the data
    invoke('write_json', { "path": jsonPath, "jsonKey": key, "value": value });
}