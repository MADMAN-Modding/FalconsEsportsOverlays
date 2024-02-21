setInterval(function () {
    fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {

            // Switch Statement to turn the left scores on and off
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

            // Switch Statement to turn the right scores on and off
            switch (jsonData['scoreRight']) {
                case "3":
                    document.getElementById("scoreRightThree").style.backgroundColor = jsonData['teamColorRight'];
                    document.getElementById("scoreRightTwo").style.backgroundColor = jsonData['teamColorRight'];
                    document.getElementById("scoreRightOne").style.backgroundColor = jsonData['teamColorRight'];
                    break;
                case "2":
                    document.getElementById("scoreRightThree").style.backgroundColor = "transparent";
                    document.getElementById("scoreRightTwo").style.backgroundColor = jsonData['teamColorRight'];
                    document.getElementById("scoreRightOne").style.backgroundColor = jsonData['teamColorRight'];
                    break;
                case "1":
                    document.getElementById("scoreRightThree").style.backgroundColor = "transparent";
                    document.getElementById("scoreRightTwo").style.backgroundColor = "transparent";
                    document.getElementById("scoreRightOne").style.backgroundColor = jsonData['teamColorRight'];
                    break;
                case "0":
                    document.getElementById("scoreRightThree").style.backgroundColor = "transparent";
                    document.getElementById("scoreRightTwo").style.backgroundColor = "transparent";
                    document.getElementById("scoreRightOne").style.backgroundColor = "transparent";
                    break;
            }

            // Updates the Team Names
            document.getElementById("teamNameLeft").innerHTML = jsonData["teamNameLeft"];
            document.getElementById("teamNameRight").innerHTML = jsonData["teamNameRight"];


            console.log(jsonData["teamNameLeft"]);
        })
}, 3000)