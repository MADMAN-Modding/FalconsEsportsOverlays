setInterval(function () {
    fetch('../overlay.json')
    .then((response) => response.json())
    .then((jsonData) => {
        switch (jsonData['scoreLeft']) {
            case "3":
                document.getElementById("scoreLeftThree").style.backgroundColor = "black";
                break;
            case "2":
                document.getElementById("scoreLeftThree").style.backgroundColor = "transparent";
        }
        document.getElementById("teamNameLeft").innerHTML = jsonData["teamNameLeft"];
    })
}, 3000)