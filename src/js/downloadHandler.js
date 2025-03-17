/**
 * Push Notification when Started
 * Start the Download
 * Push Notification when Complete if Successful
 * @async
 */
async function downloadFiles(action) {
    pushNotification(`${action.replace("Update", "Updat")}ing Overlays`);

    invoke('download_and_extract', { "preserve" : true})
        .then(() => {genURLS(); updateOverlayList(); pushNotification(`${action} Complete`)})
        .catch((error) => pushNotification(`${action} Failed: ${error}`));
}

/**
 * Push Notification when Started
 * Start the Reset
 * Push Notification when Complete if Successful
 */
function resetFiles() {
    pushNotification("Resetting Overlays");

    invoke('reset_overlays')
        .then(() => {genURLS(); updateOverlayList(); pushNotification("Reset Complete")})
        .catch((error) => pushNotification(`Reset Failed: ${error}`));
}

async function setupDownloads() {
    if (urls[0] === "NOT_SET") {
        let paths = [];
        let codeDir = await invoke("get_code_dir");

        for (const overlay of overlays) {
            paths.push(`${codeDir}/overlays/images/${overlay}.png`);
        }

        await genURLS();
    }

    let overlayDownloads = document.getElementById("overlayDownloads");
    let html = "";

    for (let i = 0; i < overlays.length; i++) {
        if (i % 3 === 0) {
            if (i !== 0) html += "</div>";  // Close the previous row
            html += "<div class=\"row\">";  // Start a new row
        }

        let overlay = overlays[i];
        let url = urls[i];  // Current URL

        html += `
        <div class="col">
            <button id="${overlay}-download" class="overlay-download" onclick="switchOverlay('${overlay}')">
                <img src="${url}" class="img-fluid" alt="${nameMap[overlay]}" />
            </button>
        </div>`;
    }

    html += "</div>";  // Close the last row
    overlayDownloads.innerHTML = html;  // Assign content once for better performance
}
