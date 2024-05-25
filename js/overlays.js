// This file is for overlay universal functions

function outputJSON(key, data) {
    return document.getElementById('body').innerHTML = document.getElementById('body').innerHTML + "<h1 id='" + key + "'>" + data + "</h1>";
}