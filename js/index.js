setInterval(function () {
    fetch('../overlay.json')
    .then((response) => response.json())
    .then((jsonData) => {
        switch (jsonData['scoreLeft']) {
            case "3":
                document.getElementById("scoreLeftThree").style.backgroundColor = "red";
                document.getElementById("scoreLeftTwo").style.backgroundColor = "red";
                document.getElementById("scoreLeftOne").style.backgroundColor = "red";
                break;
            case "2":
                document.getElementById("scoreLeftThree").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftTwo").style.backgroundColor = "red";
                document.getElementById("scoreLeftOne").style.backgroundColor = "red";
                break;
            case "1":
                document.getElementById("scoreLeftThree").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftTwo").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftOne").style.backgroundColor = "red";
                break;
            case "0":
                document.getElementById("scoreLeftThree").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftTwo").style.backgroundColor = "transparent";
                document.getElementById("scoreLeftOne").style.backgroundColor = "transparent";
                break;
        }
        document.getElementById("teamNameLeft").innerHTML = jsonData["teamNameLeft"];
        document.getElementById("teamNameRight").innerHTML = jsonData["teamNameRight"];
    })
}, 3000)