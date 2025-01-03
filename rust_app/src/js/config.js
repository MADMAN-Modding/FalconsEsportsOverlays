/** 
 * Setup function that gets the page ready
 * @returns {void}
 * @async
*/
async function setupConfig() {
    let color = await read_config_json("appTheme");

    document.getElementById("appColorInput").value = `${color}`;

    generateCheckBoxes();

    overlays.forEach(async overlay => {
        let value = await read_config_json(`${overlay}Checked`);

        document.getElementById(`${overlay}`).checked = (value === "true");
    })

    setImage();
}


/**
 * Creates a checkbox for each overlay, referencing the sport names 
 * defined in the @var nameMap map.
 */

function generateCheckBoxes() {
    let checkBoxes = document.getElementById("checkBoxes");

    overlays.forEach(overlay => {
        checkBoxes.innerHTML += `<input type="checkbox" onchange="toggleSport()" id="${overlay}" name="${overlay}"><label for="${overlay}">${nameMap[overlay]}</label><br>`
    });
}

/**   
 * Gets the color when the new value is set and sends it over to @function setColor
*/
function getColor() {
    let color = document.getElementById("appColorInput").value;

    setColor(color, false);
}

/**
 * Sets the color of the app and saves it to the config
 * @param {String} color Color to set the background to
 * @param {bool} setup Whether or not this being called when the app launches
 * @returns {void}
 * @async
 */
async function setColor(color, setup) {
    // Checks if the color is pure white
    if (color == "#ffffff") {
        push_notification("Don't set the color to white...");
        return;
    }

    // If this isn't the setup it will write the new value to the config and then notify the user
    if (!setup) {
        await write_config_json("appTheme", color);

        push_notification(`Color Updated to ${color}`)
    }

    // Sets the color of the app
    document.documentElement.style.setProperty('--app-color', `${color}`);
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

        write_config_json(`${overlay}Checked`, value.toString());

        // Sends a notification if the new value is different than the old one
        if (value.toString() !== await read_config_json(`${overlay}Checked`)) {
            let text = value ? "Enabled" : "Disabled";

            push_notification(`${text} ${nameMap[overlay]}`);
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
*/
async function setImage() {
    let bytes = await invoke("get_tauri_bytes")
        .then((value) => bytes = value)
        .catch((error) => {push_notification(error); return;});

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