let i = 0;

setInterval(function () {
  fetch("../json/overlay.json?" + i)
    .then((response) => response.json())
    .then((jsonData) => {
      // Gets the value of jsonData as an int
      const winsLeft = +jsonData["winsLeft"];
      const winsRight = +jsonData["winsRight"];

      let scoreArray = ["arcOne", "arcTwo", "arcThree", "arcFour"];

      // Update the left side rounds won
      for (let i = 1; i <= 4; i++) {
        document.getElementById(scoreArray[i - 1] + "Left").style.stroke =
          winsLeft >= i ? "#FFF" : "#000";
      }

      document.getElementById("circleLeft").style.fill =
        winsLeft == 5 ? "white" : "black";

      // Update the right side rounds won
      for (let i = 1; i <= 4; i++) {
        document.getElementById(scoreArray[i - 1] + "Right").style.stroke =
          winsRight >= i ? "#FFF" : "#000";
      }

      document.getElementById("circleRight").style.fill =
        winsRight == 5 ? "white" : "black";

      // Sets all the home team respective colors
      let teamColorLeft = jsonData["teamColorLeft"];
      changeBackgroundColor("cardLeft", teamColorLeft);

      // Set the away team respective colors
      let teamColorRight = jsonData["teamColorRight"];
      changeBackgroundColor("cardRight", teamColorRight);

      // Update Text values
      document.getElementById("teamNameLeft").innerHTML =
        jsonData["teamNameLeft"];
      document.getElementById("teamNameRight").innerHTML =
        jsonData["teamNameRight"];
      document.getElementById("week").innerHTML = jsonData["week"];
    });
  i = Math.floor(Math.random() * 1000000);
}, 100);

function changeBackgroundColor(id, color) {
  document.getElementById(id).style.fill = color;
}
