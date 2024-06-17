setInterval(function () {
    fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {

            // Gets the value of jsonData as an int
            const winsLeft = +jsonData["winsLeft"];
            const winsRight = +jsonData["winsRight"];

            // Update the left side rounds won
            for (let i = 1; i <= 3; i++) {
                document.getElementById(`leftRoundsWon${i}`).style.backgroundColor = winsLeft >= i ? "white" : "black";
            }

            // Update the right side rounds won
            for (let i = 1; i <= 3; i++) {
                document.getElementById(`rightRoundsWon${i}`).style.backgroundColor = winsRight >= i ? "white" : "black";
            }
            
            // Sets all the home team respective colors
            let teamColorLeft = jsonData["teamColorLeft"];
            changeBackgroundColor("teamNameLeftBackground", teamColorLeft);
            changeBackgroundColor("leftRoundsBack", teamColorLeft);
            changeBackgroundColor("week", teamColorLeft);

            // Set the away team respective colors
            let teamColorRight = jsonData["teamColorRight"];

        });
}, 100);


function changeBackgroundColor(id, color) {
    document.getElementById(id).style.backgroundColor = color;
}