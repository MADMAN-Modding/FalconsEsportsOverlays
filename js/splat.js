let i = 0;

setInterval(function () {
  fetch("../json/overlay.json?" + i)
    .then((response) => response.json())
    .then((jsonData) => {
      const winsLeft = +jsonData["winsLeft"];
      const winsRight = +jsonData["winsRight"];

      // Update the left side rounds won
      for (let i = 1; i <= 3; i++) {
        document.getElementById(`leftRoundsWon${i}`).style.fill =
          winsLeft >= i ? jsonData["teamColorLeft"] : "black";
      }

      // Update the right side rounds won
      for (let i = 1; i <= 3; i++) {
        document.getElementById(`rightRoundsWon${i}`).style.fill =
          winsRight >= i ? jsonData["teamColorRight"] : "black";
      }

      document.getElementById("overlay").style.fill = jsonData["teamColorLeft"];

      // document.getElementById("weekText").style.color = jsonData["teamColorLeft"];

      // Updates the Team Names and week
      document.getElementById("teamNameLeft").innerHTML =
        jsonData["teamNameLeft"];
      document.getElementById("teamNameRight").innerHTML =
        jsonData["teamNameRight"];
      document.getElementById("week").innerHTML = jsonData["week"];
      // document.getElementById("playerNamesLeft").innerHTML =
      //   jsonData["playerNamesLeft"];
      // document.getElementById("playerNamesRight").innerHTML =
      //   jsonData["playerNamesRight"];
      // document.getElementById("scoreLeft").innerHTML = jsonData["scoreLeft"];
      // document.getElementById("scoreRight").innerHTML = jsonData["scoreRight"];
    });
  i = Math.floor(Math.random() * 1000000);
}, 100);
