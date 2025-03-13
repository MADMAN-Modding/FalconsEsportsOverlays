/**
 * Push Notification when Started
 * Start the Download
 * Push Notification when Complete if Successful
 * @async
 */
async function downloadFiles(action) {
    pushNotification(`${action.replace("Update", "Updat")}ing Overlays`);

    invoke('download_and_extract', { "preserve" : true})
        .then(() => {genURLS(); pushNotification(`${action} Complete`)})
        .catch((error) => pushNotification(`${action} Failed: ${error}`));

    updateOverlayList();
}

/**
 * Push Notification when Started
 * Start the Reset
 * Push Notification when Complete if Successful
 */
function resetFiles() {
    pushNotification("Resetting Overlays");

    invoke('reset_overlays')
        .then(() => {genURLS(); pushNotification("Reset Complete")})
        .catch((error) => pushNotification(`Reset Failed: ${error}`));

    updateOverlayList();
}