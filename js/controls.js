fetch('../overlay.json')
  .then((response) => response.json())
  .then((jsonData) => {
    switch (jsonData['scoreLeft']) {
      case "0": {
        let radioButton = document.getElementById("radioLeft0");
        radioButton.checked = true;
        break;
      }
      case "1": {
        let radioButton = document.getElementById("radioLeft1");
        radioButton.checked = true;
        break;
      }
      case "2": {
        let radioButton = document.getElementById("radioLeft2");
        radioButton.checked = true;
        break;
      }
      case "3": {
        let radioButton = document.getElementById("radioLeft3");
        radioButton.checked = true;
        break;
      }
    }

    switch (jsonData['scoreRight']) {
      case "0": {
        let radioButton = document.getElementById("radioRight0");
        radioButton.checked = true;
        break;
      }
      case "1": {
        let radioButton = document.getElementById("radioRight1");
        radioButton.checked = true;
        break;
      }
      case "2": {
        let radioButton = document.getElementById("radioRight2");
        radioButton.checked = true;
        break;
      }
      case "3": {
        let radioButton = document.getElementById("radioRight3");
        radioButton.checked = true;
        break;
      }
    }
  });