function buildButton(id, text, onclick) {
    console.log(id);
    let button = document.getElementById(id);
    button.innerHTML = text;
    button.onclick = onclick;
}