function setupConfig() {
    // invoke("get_code_dir_image_path").then((value) => document.getElementById("esportsLogo").src = value);
}

function changeColor() {
    const color = document.getElementById("appColorInput").value;

    if (color == "#ffffff") {
        push_notification("Don't set the color to white...");
        return;
    }

    document.documentElement.style.setProperty('--app-color', `${color}`);
}