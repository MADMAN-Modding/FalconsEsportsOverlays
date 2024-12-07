// This file is for overlay universal functions
let updateInterval = 2000;

function outputJSON(key, data) {
    return document.getElementById('body').innerHTML = document.getElementById('body').innerHTML + "<h1 id='" + key + "'>" + data + "</h1>";
}

fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {

        for (const key in jsonData) {
            outputJSON(key, jsonData[key]);
        }
});