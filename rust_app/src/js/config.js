async function setupConfig() {
    let color = await read_config_json("appTheme");

    document.getElementById("appColorInput").value = `${color}`;

    generateCheckBoxes();

    overlays.forEach(async overlay => {
        let value = await read_config_json(`${overlay}Checked`);

        document.getElementById(`${overlay}`).checked = (value === "true");
    })

    // invoke("get_code_dir_image_path").then((value) => document.getElementById("esportsLogo").src = value);
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