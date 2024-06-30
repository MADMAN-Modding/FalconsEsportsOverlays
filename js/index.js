let overlayiFrame;
let i = 0;
setInterval(function () {
        fetch('../json/overlay.json?' + i)
            .then((response) => response.json())
            .then((jsonData) => {
                overlayiFrame = document.getElementById('overlayiFrame');

                // Returns if the overlay is already set
                if (overlayiFrame.src.includes(jsonData['overlay'])) {
                    return;
                }

                // Loads the correct overlay
                overlayiFrame.src = "http://localhost:8080/overlays/" + jsonData["overlay"] + ".html";

                document.title = jsonData["overlay"].charAt(0).toUpperCase() + jsonData["overlay"].slice(1)
            })
    i = Math.floor(Math.random() * 1000000);
}, 200)