// Stores how many milliseconds left till the notification hides itself
let timeLeft = 5000;

async function push_notification(text) {
    let notificationBox = document.getElementById("notification");
    let notificationText = document.getElementById("notificationText");

    notificationText.innerHTML = text;


    notificationBox.style.top = "20px";
    setTimeout(() => {
        notificationText.innerHTML = "";
        notificationBox.style.top = "-80px";
    }, timeLeft)

}