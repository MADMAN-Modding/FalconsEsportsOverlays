// Makes a button, I don't think I really used this too much but its here
function buildButton(id, text, onclick) {
    let button = document.getElementById(id);
    button.innerHTML = text;
    button.onclick = onclick;
}