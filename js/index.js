setInterval(function () {
    fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {
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