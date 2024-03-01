// setInterval(function () {
//     fetch('../json/overlay.json')
//         .then((response) => response.json())
//         .then((jsonData) => {
//             if (jsonData["overlay"] == "ssbu" && previousOverlay != "ssbu") {
//                 previousOverlay = "ssbu";
//                 console.log(previousOverlay);
//                 window.location.href = "../overlays/ssbu.php";
//             } else if (jsonData["overlay"] == "kart" && previousOverlay != "kart") {
//                 previousOverlay = "kart";
//                 window.location.href = "../overlays/kart.php";
//             }
//         })
// }, 3000)

// Makes the xhr object for the XMLHttpRequest class
var xhr = new XMLHttpRequest();

// Calls the refresh function
xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            document.getElementById(js).innerHTML =
                xhr.responseText;
        } else {
            console.log('Error Code: ' + xhr.status);
            console.log('Error Message: ' + xhr.statusText);
        }
    }
}

setInterval(function () {
    fetch('../json/overlay.json')
        .then((response) => response.json())
        .then((jsonData) => {
            if (jsonData["overlay"] == "ssbu" && previousOverlay != "ssbu") {
                previousOverlay = "ssbu";
                console.log(previousOverlay);
                xhr.open('GET', 'fileHandler.php?overlay=ssbu');
            } else if (jsonData["overlay"] == "kart" && previousOverlay != "kart") {
                previousOverlay = "kart";
                xhr.open('GET', 'fileHandler.php?overlay=kart');
            }
        })
}, 3000)
// Send the request 
xhr.send();
