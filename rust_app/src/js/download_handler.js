/**
 * Push Notification when Started
 * Start the Download
 * Push Notification when Complete if Successful
 * @async
 */
async function download_files(action) {
    push_notification(`${action}ing Overlays`);

    invoke('download_and_extract')
        .then(() => push_notification(`${action} Complete`))
        .catch((error) => push_notification(`${action} Failed: ${error}`));
}

/**
 * Push Notification when Started
 * Start the Reset
 * Push Notification when Complete if Successful
 * @async
 */
async function reset_files() {
    push_notification("Resetting Overlays");

    invoke('reset_overlays')
        .then(() => push_notification("Reset Complete"))
        .catch((error) => push_notification(`Reset Failed: ${error}`));
}