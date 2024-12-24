// Stores how many milliseconds until the notification hides itself
let displayTime = 3000;

async function push_notification(text) {
    let notificationBox = document.getElementById("notification");
    let notificationText = document.getElementById("notificationText");

    notificationText.innerHTML = text;


    notificationBox.style.top = "20px";
    setTimeout(() => {
        notificationText.innerHTML = "";
        notificationBox.style.top = "-80px";
    }, displayTime)

}