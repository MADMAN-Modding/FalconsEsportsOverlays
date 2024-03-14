setInterval(function () {
    fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {
            //     if (jsonData["overlay"] == "ssbu" && previousOverlay != "ssbu") {
            //         previousOverlay = "ssbu";
            //         console.log(previousOverlay);
            //         xhr.open('GET', 'fileHandler.php?overlay=ssbu');
            //     } else if (jsonData["overlay"] == "kart" && previousOverlay != "kart") {
            //         previousOverlay = "kart";
            //         xhr.open('GET', 'fileHandler.php?overlay=kart');
            //     }
            // })

            if (window.location.href.includes(jsonData["overlay"])) {
                return;
            } else {
                if(window.location.href.includes("overlays/")) {
                    window.location.href = jsonData["overlay"] + ".php";
                } else {
                window.location.href = "overlays/" + jsonData["overlay"] + ".php"
                }
            }
        })
}, 3000)