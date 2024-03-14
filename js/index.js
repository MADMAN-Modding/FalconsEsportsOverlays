setInterval(function () {
    fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {
            document.getElementById("teamNameLeft").innerHTML = jsonData["teamNameLeft"];
            document.getElementById("teamNameRight").innerHTML = jsonData["teamNameRight"];
            document.getElementById("winsLeft").innerHTML = jsonData["winsLeft"];
            document.getElementById("winsRight").innerHTML = jsonData["winsRight"];
            document.getElementById("week").innerHTML = jsonData["week"];
            document.getElementById("scoreRight").innerHTML = jsonData["scoreLeft"];
            document.getElementById("scoreLeft").innerHTML = jsonData["scoreRight"];
            document.getElementById("playerNamesLeft").innerHTML = jsonData["playerNamesLeft"];
            document.getElementById("playerNamesRight").innerHTML = jsonData["playerNamesRight"];

            // If the correct page is already loaded do nothing
            if (window.location.href.includes(jsonData["overlay"])) {
                return;
            } else {
                // Checks if the page is an overlay or not
                if (window.location.href.includes("overlays/")) {
                    // Loads the correct overlay
                    window.location.href = jsonData["overlay"] + ".php";
                } else {
                    // If the page isn't an overlay loads the correct page
                    window.location.href = "overlays/" + jsonData["overlay"] + ".php"
                }
            }
        })
}, 3000)