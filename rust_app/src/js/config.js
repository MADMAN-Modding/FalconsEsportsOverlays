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

function generateCheckBoxes() {
    let checkBoxes = document.getElementById("checkBoxes");

    overlays.forEach(overlay => {
        checkBoxes.innerHTML += `<input type="checkbox" onchange="toggleSport()" id="${overlay}" name="${overlay}"><label for="${overlay}">${nameMap[overlay]}</label><br>`
    });
}

function getColor() {
    let color = document.getElementById("appColorInput").value;

    setColor(color, false);
}

async function setColor(color, setup) {
    if (color == "#ffffff") {
        push_notification("Don't set the color to white...");
        return;
    }

    if (!setup) {
        await write_config_json("appTheme", color);

        push_notification(`Color Updated to ${color}`)
    }

    document.documentElement.style.setProperty('--app-color', `${color}`);
}

function toggleSport() {
    overlays.forEach(async overlay => {
        let value = document.getElementById(overlay).checked;

        write_config_json(`${overlay}Checked`, value.toString());

        // Checks to see if the new value is different than the old one
        if (value.toString() !== await read_config_json(`${overlay}Checked`)) {
            console.log(overlay);
            console.log(value);
            console.log(read_config_json(`${overlay}Checked`));

            let text = value ? "Enabled" : "Disabled";
        
            push_notification(`${text} ${nameMap[overlay]}`);
        }
    });
}

async function updateImage() {
    let file = document.getElementById("newLogo").files[0];

    console.log(file);

    let byte_array = new Uint8Array(await readFile(file));

    setImage(byte_array);

    // Copies the selected image to the code dir
    await invoke('copy_image', {"bytes" : byte_array});
}

async function setImage() {
    let bytes;
    
    await invoke("get_tauri_bytes")
        .then((value) => bytes = value)
        .catch((error) => {push_notification(error); return;});

    bytes = new Uint8Array(bytes);

    const blob = new Blob([bytes], { type: "image/png" });
    const imageURL = URL.createObjectURL(blob);
    document.getElementById("esportsLogo").src = imageURL;
}

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