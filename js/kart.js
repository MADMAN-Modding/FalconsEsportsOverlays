let i = 0;

document.getElementById("schoolLogo").src =
  "../images/Esports-Logo.png?" + Math.floor(Math.random() * 1000000);

setInterval(function () {
  fetch("../json/overlay.json?" + i)
    .then((response) => response.json())
    .then((jsonData) => {
      // Gets the value of jsonData as an int
      const winsLeft = +jsonData["winsLeft"];
      const winsRight = +jsonData["winsRight"];

      // Update the left side rounds won
      for (let i = 1; i <= 2; i++) {
        document.getElementById(`leftRoundsWon${i}`).style.fill =
          winsLeft >= i ? "white" : "black";
      }

      // Update the right side rounds won
      for (let i = 1; i <= 2; i++) {
        document.getElementById(`rightRoundsWon${i}`).style.fill =
          winsRight >= i ? "white" : "black";
      }

      // Updates the Team Names and week
      document.getElementById("teamNameLeft").innerHTML =
        jsonData["teamNameLeft"];
      document.getElementById("teamNameRight").innerHTML =
        jsonData["teamNameRight"];
      document.getElementById("week").innerHTML = jsonData["week"];
      document.getElementById("playerNamesLeft").innerHTML =
        jsonData["playerNamesLeft"];
      document.getElementById("playerNamesRight").innerHTML =
        jsonData["playerNamesRight"];
      document.getElementById("scoreLeft").innerHTML = jsonData["scoreLeft"];
      document.getElementById("scoreRight").innerHTML = jsonData["scoreRight"];

      if (+document.getElementById("week").innerHTML > 9) {
        document.getElementById("week").style.left = "1862px";
        document.getElementById("week").style.top = "984px"
        document.getElementById("week").style.fontSize = "40px";
      } else {
        document.getElementById("week").style.left = "1870px";
      document.getElementById("week").style.top = "970px";
      document.getElementById("week").style.fontSize = "48px";
      }


      // Sets all the home team respective colors
      document.documentElement.style.setProperty('--homeTheme', jsonData["teamColorLeft"]);
      document.documentElement.style.setProperty('--awayTheme', jsonData["teamColorRight"]);

      if (jsonData["playerNamesLeft"].length >= 24) {
        document.getElementById("playerNamesLeft").style.top = "503px";
      } else {
        document.getElementById("playerNamesLeft").style.top = "509px";
      }

      if (jsonData["playerNamesRight"].length <= 23) {
        document.getElementById("playerNamesRight").style.top = "536px";
      } else {
        document.getElementById("playerNamesRight").style.top = "530px";
      }
    });

  i = Math.floor(Math.random() * 1000000);
}, 2000);