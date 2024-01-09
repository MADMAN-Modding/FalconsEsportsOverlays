fetch('../overlay.json')
    .then((response) => response.json())
    .then((jsonData) => {
        switch (jsonData['scoreLeft']) {
            case "3":
                document.getElementById("scoreLeftThree").style.backgroundColor = "black";
        }
    })