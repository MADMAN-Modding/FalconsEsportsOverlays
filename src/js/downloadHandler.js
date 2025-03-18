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

        for (const overlay in downloadableOverlays.keys) {
            console.log(overlay)
            paths.push(`${codeDir}/overlays/images/${overlay}.png`);
        }
        await genURLS();
    }

    let overlayDownloads = document.getElementById("overlayDownloads");
    let html = "";

    let i = 0;

    for (const overlay in downloadableOverlays) {
        if (i >= downloadableOverlays.length) return;

        if (i % 3 === 0) {
            if (i !== 0) html += "</div>";  // Close the previous row
            html += "<div class=\"row\">";  // Start a new row
        }

        // let url = urls[i];  // Current URL

        html += `
        <div class="col" id="download">
            <button id="${overlay}-download" class="overlay-download" onclick="downloadOverlay('${overlay}')">
                <p><div id="${overlay}-status" class="overlay-status"></div>${nameMap[overlay]}</p>
            </button>
        </div>`;
        i++;
    }

    html += "</div>";  // Close the last row
    overlayDownloads.innerHTML = html;  // Assign content once for better performance
}

async function downloadOverlay(id) {
    invoke("download_selected_overlay", {"overlay" : id}).then(() => pushNotification(`Overlay ${nameMap[id]} Downloaded`));
}