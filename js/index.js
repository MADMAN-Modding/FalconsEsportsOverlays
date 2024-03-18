let fetchCompleted = true;

setInterval(function () {
    if (fetchCompleted) {
        fetch('../json/overlay.json')
            .then((response) => response.json())
            .then((jsonData) => {
                overlayiFrame = document.getElementById('overlayiFrame');

                // Returns if the overlay is already set
                if (overlayiFrame.src.includes(jsonData['overlay'])) {
                    return;
                }

                // Loads the correct overlay
                overlayiFrame.src = "overlays/" + jsonData["overlay"] + ".php";

                document.title = jsonData["overlay"].charAt(0).toUpperCase() + jsonData["overlay"].slice(1)
            })
    }
}, 1500)