/** 
 * Setup function that gets the page ready
 * @returns {void}
 * @async
*/
async function setupConfig() {
    let appColor = await readConfigJSON("appColor");
    let columnColor = await readConfigJSON("columnColor");

    document.getElementById("appColorInput").value = `${appColor}`;
    document.getElementById("columnColorInput").value = `${columnColor}`;

    generateCheckBoxes();

    overlays.forEach(async overlay => {
        let value = await readConfigJSON(`${overlay}Checked`);

        document.getElementById(`${overlay}`).checked = (value !== "false");
    })

    // Sets the checkbox values
    // document.getElementById("autoUpdate").checked = (await readConfigJSON("autoUpdate") === "true");
    document.getElementById("autoServer").checked = (await readConfigJSON("autoServer") === "true");
    // document.getElementById("overlayURL").value = await readConfigJSON("overlayURL");

    setImage();

    let scenes = await getSceneCollectionList();

    scenes.forEach(scene => {
        document.getElementById("sceneCollections").innerHTML += `<option value="${scene}">${scene}</option>`
    });

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
        let name;
        if (nameMap[overlay] === undefined) {
            name = overlay;
        } else {
            name = nameMap[overlay];
        }

        checkBoxes.innerHTML += `<input type="checkbox" onchange="toggleSport()" id="${overlay}" name="${overlay}"><label for="${overlay}">${name}</label><br>`
    });
}

/**   
 * Gets the color when the new value is set and sends it over to @function setColor
*/
function setAppColor() {
    let color = document.getElementById("appColorInput").value;

    updateAppColor(color, false);
}

/**
 * Sets the color of the app and saves it to the config
 * @param {String} color Color to set the background to
 * @param {bool} setup Whether or not this is being called when the app launches
 * @returns {void}
 * @async
 */
async function updateAppColor(color, setup) {
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

function setColumnColor() {
    let color = document.getElementById("columnColorInput").value;

    updateColumnColor(color, false);
}

/**
 * Sets the color of the column and saves it to the config
 * @param {String} color Color to set the column to 
 * @param {bool} setup Whether or not this is being called when the app launches
 * @returns {void}
 * @async
 */
async function updateColumnColor(color, setup) {
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
    
    let imagePath = await invoke("get_code_dir_image_path");

    bytes = await invoke('get_image_bytes', {"imagePath" : imagePath})
        .then((value) => bytes = value)
        .catch((error) => {pushNotification(error); return;});

    bytes = new Uint8Array(bytes);

    const blob = new Blob([bytes], { type: "image/png" });
    const imageURL = URL.createObjectURL(blob);

    document.getElementById("esportsLogo").src = imageURL;
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
    updateAppColor(await readConfigJSON("appColor"), false);

    // Set column color
    updateColumnColor(await readConfigJSON("columnColor"), false);

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
    updateAppColor(appColor, true);

    document.getElementById("appColorInput").value = `${appColor}`;

    // Downloads the new overlays
    await downloadFiles("Update");
    
    // Applies the new logo
    await setImage();
}

function changeOverlayURL() {
    let url = document.getElementById("overlayURL").value;

    writeConfigJSON("overlayURL", url);

    pushNotification("Overlay URL Updated");
}