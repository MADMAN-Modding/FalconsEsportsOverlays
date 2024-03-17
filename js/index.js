let overlayiFrame;

setInterval(function () {
    fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {
            overlayiFrame = document.getElementById('overlayiFrame');
            // Loads the correct overlay
            if(overlayiFrame.src.includes(jsonData['overlay'])) {
                return;
            }
            
            overlayiFrame.src = "overlays/" + jsonData["overlay"] + ".php";


            document.title = jsonData["overlay"].charAt(0).toUpperCase() + jsonData["overlay"].slice(1)
        })
}, 1500)