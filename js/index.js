setInterval(function () {
    fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {
            const winsLeft = +jsonData["winsLeft"];
            const winsRight = +jsonData["winsRight"];

            // Update the left side rounds won
            for (let i = 1; i <= 2; i++) {
                document.getElementById(`leftRoundsWon${i}`).style.backgroundColor = winsLeft >= i ? "white" : "black";
            }

            // Update the right side rounds won
            for (let i = 1; i <= 2; i++) {
                document.getElementById(`rightRoundsWon${i}`).style.backgroundColor = winsRight >= i ? "white" : "black";
            }

            // Updates the Team Names and week
            document.getElementById("teamNameLeft").innerHTML = jsonData["teamNameLeft"];
            document.getElementById("teamNameRight").innerHTML = jsonData["teamNameRight"];
            document.getElementById("week").innerHTML = jsonData["week"];
        });
}, 3000);
