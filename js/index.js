setInterval(function () {
    fetch('../overlay.json')
    .then((response) => response.json())
    .then((jsonData) => {
        switch (jsonData['scoreLeft']) {
            case "3":
                document.getElementById("scoreLeftThree").style.backgroundColor = "black";
                document.getElementById("scoreLeftTwo").style.backgroundColor = "black";
                document.getElementById("scoreLeftOne").style.backgroundColor = "black";
                break;
            case "2":
                document.getElementById("scoreLeftThree").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftTwo").style.backgroundColor = "black";
                document.getElementById("scoreLeftOne").style.backgroundColor = "black";
            case "1":
                document.getElementById("scoreLeftThree").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftTwo").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftOne").style.backgroundColor = "black";
            case "0":
                document.getElementById("scoreLeftThree").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftTwo").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftOne").style.backgroundColor = "transparent";
        }
        document.getElementById("teamNameLeft").innerHTML = jsonData["teamNameLeft"];
        document.getElementById("teamNameRight").innerHTML = jsonData["teamNameRight"];
    })
}, 3000)