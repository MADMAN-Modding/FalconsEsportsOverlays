fetch('../json/overlay.json')
  .then((response) => response.json())
  .then((jsonData) => {

    document.getElementById("winsLeft" + jsonData["winsLeft"]).checked = true;
    document.getElementById("winsRight" + jsonData["winsRight"]).checked = true;
  });

function overlaySender(overlayValue) {
  var xmlhttp = new XMLHttpRequest();
  // Makes the form
  xmlhttp.open("GET", "jsonWriter.php?overlay=" + overlayValue, true);
  // Sends the data
  xmlhttp.send();
}