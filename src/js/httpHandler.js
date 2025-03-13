// Keeps track of the server's status
let server = false;

/**
 * Starts the server by invoking the 'run_server' function.
 *
 * On success, displays a notification and updates the server state to 'on'.
 *
 * On failure, displays an error notification.
 * 
 * @async
 * @returns {void}
 */
async function startServer(image) {
    invoke('run_server')
        .then((message) => {
            pushNotification(message); // Notify the user of the successful server start.

            server = true; // Set the server state to 'on'.
            if (image) {
                serverOn(); // Update the server state and UI to 'on'.
            }
        })
        .catch((error) => {pushNotification(error); console.log(error)}); // Notify the user of the error.
}

/**
 * Stops the server by invoking the 'stop_server' function.
 *
 * On success, displays a notification and updates the server state to 'off'.
 *
 * On failure, displays an error notification.
 * @async
 * @returns {void}
 */
async function stopServer() {
    invoke('stop_server')
        .then((message) => {
            pushNotification(message); // Notify the user of the successful server stop.

            serverOff(); // Update the server state and UI to 'off'.
        })
        .catch((error) => pushNotification(error)); // Notify the user of the error.
}

/**
 * Updates the server state to 'on' and changes the server image to reflect the active state.
 * @returns {void}
 */
function serverOn() {
    document.getElementById("serverImage").src = "../images/ServerOn.png"; // Update the server image.
}

/**
 * Updates the server state to 'off' and changes the server image to reflect the inactive state.
 * @returns {void}
 */
function serverOff() {
    server = false; // Set the server state to 'off'.

    document.getElementById("serverImage").src = "../images/ServerOff.png"; // Update the server image.
}

/**
 * Sets up the initial server UI based on the server state.
 *
 * Ensures the correct server image is displayed (on/off).
 *
 * Includes a workaround to fix an issue with the image not centering properly.
 * @returns {void}
 */
function setupServer() {
    // Set the initial server image based on the current server state.
    document.getElementById("serverImage").src = ("../images/Server" + (server ? "On.png" : "Off.png"));

    // Workaround: Fixes an issue with the image not centering properly.
    document.getElementById("serverImage").style.width = "20px"; // Temporarily reduce the width.

    setTimeout(function() {
        document.getElementById("serverImage").style.width = "200px"; // Restore the width after a short delay.
    }, 200);
}
