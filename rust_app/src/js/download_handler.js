/**
 * Push Notification when Started
 * Start the Download
 * Push Notification when Complete 
 */

async function download_files(action) {
    push_notification(`${action}ing Overlays`);

    await invoke('download_and_extract');

    push_notification(`${action} Complete`)
}

/**
 * Push Notification when Started
 * Start the Reset
 * Push Notification when Complete 
 */

async function reset_files() {
    push_notification("Resetting Overlays");

    await invoke('reset_overlays');

    push_notification("Reset Complete");
}