// Used to check the buttons, I'll probably rewrite this in PHP eventually

  fetch('../json/overlay.json')
    .then((response) => response.json())
    .then((jsonData) => {
      switch (jsonData['scoreLeft']) {
        case "0": {
          let radioButton = document.getElementById("scoreLeft0");
          radioButton.checked = true;
          scoreLeft = 0
          break;
        }
        case "1": {
          let radioButton = document.getElementById("scoreLeft1");
          radioButton.checked = true;
          scoreLeft = 1
          break;
        }
        case "2": {
          let radioButton = document.getElementById("scoreLeft2");
          radioButton.checked = true;
          scoreLeft = 2
          break;
        }
        case "3": {
          let radioButton = document.getElementById("scoreLeft3");
          radioButton.checked = true;
          scoreLeft = 3
          break;
        }
      }

      switch (jsonData['scoreRight']) {
        case "0": {
          let radioButton = document.getElementById("scoreRight0");
          radioButton.checked = true;
          scoreRight = 0
          break;
        }
        case "1": {
          let radioButton = document.getElementById("scoreRight1");
          radioButton.checked = true;
          scoreRight = 1
          break;
        }
        case "2": {
          let radioButton = document.getElementById("scoreRight2");
          radioButton.checked = true;
          scoreRight = 2
          break;
        }
        case "3": {
          let radioButton = document.getElementById("scoreRight3");
          radioButton.checked = true;
          scoreRight = 3
          break;
        }
      }
    });