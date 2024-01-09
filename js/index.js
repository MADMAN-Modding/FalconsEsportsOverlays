import jsonData from "../overlay.json" assert { type: 'json' };

class jsonDataClass {

}
function main() {
    if (jsonData["scoreLeft"] == 3) {
        document.getElementById("scoreLeftThree").style.backgroundColor = "red";
        document.getElementById("h1").style.color = "red";
    } else {
        document.getElementById("scoreLeftThree").style.backgroundColor = "black";
        document.getElementById("h1").style.color = "red";

    }
}