// Stores how many milliseconds until the notification hides itself
let displayTime = 3000;
let notificationID = 0;

async function push_notification(text) {
    // Used for keeping track of notifications
    notificationID++;
    let pushID = notificationID;
    let notificationBox = document.getElementById("notification");
    let notificationText = document.getElementById("notificationText");

    notificationText.innerHTML = text;

    notificationBox.style.top = "20px";

    setTimeout(() => {
        // This allows for it to check if a new notification has been set; if a new one was set then it won't remove the current one
        if (notificationID == pushID) {
            notificationText.innerHTML = "";
            notificationBox.style.top = "-80px";
        }
    }, displayTime)

}