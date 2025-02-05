/** 
 * Setup function that gets the page ready
 * @returns {void}
 * @async
*/
async function setupConfig() {
    let color = await readConfigJSON("appColor");

    document.getElementById("appColorInput").value = `${color}`;

    generateCheckBoxes();

    overlays.forEach(async overlay => {
        let value = await readConfigJSON(`${overlay}Checked`);

        document.getElementById(`${overlay}`).checked = (value === "true");
    })

    // Sets the checkbox values
    document.getElementById("autoUpdate").checked = (await readConfigJSON("autoUpdate") === "true");
    document.getElementById("autoServer").checked = (await readConfigJSON("autoServer") === "true");

    setImage();
}


/**
 * Creates a checkbox for each overlay, referencing the sport names 
 * defined in the @var nameMap map.
 */

function generateCheckBoxes() {
    let checkBoxes = document.getElementById("checkBoxes");

    // Empties the checkboxes
    checkBoxes.innerHTML = "";

    // Makes the checkboxes
    overlays.forEach(overlay => {
        checkBoxes.innerHTML += `<input type="checkbox" onchange="toggleSport()" id="${overlay}" name="${overlay}"><label for="${overlay}">${nameMap[overlay]}</label><br>`
    });
}

/**   
 * Gets the color when the new value is set and sends it over to @function setColor
*/
function getColor() {
    let color = document.getElementById("appColorInput").value;

    setAppColor(color, false);
}

/**
 * Sets the color of the app and saves it to the config
 * @param {String} color Color to set the background to
 * @param {bool} setup Whether or not this is being called when the app launches
 * @returns {void}
 * @async
 */
async function setAppColor(color, setup) {
    // Checks if the color is pure white
    if (color == "#ffffff") {
        pushNotification("Don't set the color to white...");
        return;
    }

    // If this isn't the setup it will write the new value to the config and then notify the user
    if (!setup) {
        writeConfigJSON("appColor", color);

        pushNotification(`Color Updated to ${color}`)
    }

    // Sets the color of the app
    document.documentElement.style.setProperty('--app-color', `${color}`);
}

/**
 * Sets the color of the column and saves it to the config
 * @param {String} color Color to set the column to 
 * @param {bool} setup Whether or not this is being called when the app launches
 * @returns {void}
 * @async
 */
async function setColumnColor(color, setup) {
    // If this isn't the setup it will write the new value to the config and then notify the user
    if (!setup) {
        writeConfigJSON("columnColor", color);

        pushNotification(`Column Color Updated to ${color}`)
    }

    // Sets the color of the app
    document.documentElement.style.setProperty('--column-color', `${color}`);
}

/**
 * When any of the checkboxes are pressed;
 * this will run through all of them and update whichever one changed
 * @returns {void}
 */
function toggleSport() {
    // Loops through all the variables
    overlays.forEach(async overlay => {
        let value = document.getElementById(overlay).checked;

        writeConfigJSON(`${overlay}Checked`, value.toString());

        // Sends a notification if the new value is different than the old one
        if (value.toString() !== await readConfigJSON(`${overlay}Checked`)) {
            let text = value ? "Enabled" : "Disabled";

            pushNotification(`${text} ${nameMap[overlay]}`);
        }
    });
}

/**
 * Takes the currently selected image.
 * 
 * Makes an `Uint8Array` of the data after calling `readFile()`
 * @async
 */
async function updateImage() {
    let file = document.getElementById("newLogo").files[0];

    let byte_array = new Uint8Array(await readFile(file));
 
    // Copies the selected image to the code dir
    await invoke('copy_image', {"bytes" : byte_array});
  
    
    await setImage();
}

/**
 * Retrieves the bytes of the code directory image.
 * 
 * Creates a `Uint8Array` from the retrieved bytes.
 * 
 * Converts the `Uint8Array` into a `Blob` with the MIME type `image/png`.
 * 
 * Create of an `ObjectURL` of the blob
 * 
 * Sets the `esportsLogo` document to the `ObjectURL`
 * @async
*/
async function setImage() {
    let bytes;
    
    bytes = await invoke('get_image_bytes')
        .then((value) => bytes = value)
        .catch((error) => {pushNotification(error); return;});

    bytes = new Uint8Array(bytes);

    const blob = new Blob([bytes], { type: "image/png" });
    const imageURL = URL.createObjectURL(blob);

    document.getElementById("esportsLogo").src = imageURL;
}

/**
 * Reads the supplied file as an `ArrayBuffer`
 * @param {File} file 
 * @returns {Promise<ArrayBuffer, Error>} Promise of the file
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
        // Create file reader
        let reader = new FileReader();

        // Register event listeners
        reader.addEventListener("loadend", e => resolve(e.target.result));
        reader.addEventListener("error", reject);

        // Read file
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Sets the auto update value in the config
 * @returns {void}
 */
function toggleSetting(setting) {
    writeConfigJSON(setting, document.getElementById(setting).checked.toString());

    // Removes the "auto" from the setting key
    let notificationText = setting.split("auto")[1];
    
    pushNotification(`Auto ${notificationText} ${(document.getElementById(setting).checked ? "Enabled" : "Disabled")}`);
} 

/**
 * Resets the config to defaults and applies the changes to the app
 * @returns {void}
 * @async
 */
async function reset_config() {
    // Redownload the overlays
    resetFiles().catch((error) => {pushNotification(`Reset Failed: ${error}`); return;});    

    // Resets the page to the new values
    await switchPage("config")

    // Set page color
    setAppColor(await readConfigJSON("appColor"), false);

    // Set column color
    setColumnColor(await readConfigJSON("columnColor"), false);

    // Notifies the user the reset completed
    pushNotification("Config Reset");
}

async function makeCustomConfig() { 
    let file = document.getElementById("customConfig").files[0];

    let byte_array = new Uint8Array(await readFile(file));
 
    // Copies the selected image to the code dir
    await invoke('setup_custom_config', {"configFile" : byte_array});
  
    setNewValues();
    
    pushNotification("Custom Config Applied");
}

/**
 * Sets the new values of the config from the custom config file
 * @returns {void}
 * @async
 */
async function setNewValues() {
    let columnColor = await readConfigJSON("columnColor");

    // Sets the new value of the column color
    document.documentElement.style.setProperty('--column-color', `${columnColor}`);

    let appColor = await readConfigJSON("appColor"); 

    console.log(appColor);

    // Sets the new value of the app color
    setAppColor(appColor, true);

    document.getElementById("appColorInput").value = `${appColor}`;

    // Downloads the new overlays
    await downloadFiles("Update");
    
    // Applies the new logo
    await setImage();
}