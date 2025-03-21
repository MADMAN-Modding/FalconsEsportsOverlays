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
    let overlayDownloads = document.getElementById("overlayDownloads");
    let html = "";

    let versions = await invoke("get_versions");
    let localVersions = await invoke("get_local_versions");

    let i = 0;

    for (const overlay in downloadableOverlays) {
        if (i >= downloadableOverlays.length) return;

        let availableOverlayVersion = versions[overlay];
        let localVersion = localVersions[overlay];

        let color = "purple";

        // Determines the color of the box
        if (localVersion == availableOverlayVersion) {color = "green"}
        // -2 means the overlay was deleted
        else if (localVersion == "null" || localVersion == null || localVersion == -2) {color = "red"}
        else if (availableOverlayVersion > localVersion) {color = "yellow"}

        if (i % 3 === 0) {
            if (i !== 0) html += "</div>";  // Close the previous row
            html += "<div class=\"row\">";  // Start a new row
        }

        html += `
        <div class="col" id="download">
            <div id="${overlay}Download" class="overlay-download">
                <div class="content-wrapper">
                    <div id="${overlay}Status" style="background-color: ${color};" class="overlay-status"></div>
                    <span onclick="downloadOverlay('${overlay}')">${nameMap[overlay]}</span>
                    <img src="images/delete.png" style="width: 31px; height: 40px;" onclick="deleteOverlay('${overlay}')"/>
                </div>
            </div>
        </div>`;
        i++;
    }

    html += "</div>";  // Close the last row
    overlayDownloads.innerHTML = html;  // Assign content once for better performance
}

async function downloadOverlay(overlay) {
    await invoke("download_selected_overlay", {"overlay" : overlay}).catch(() => {pushNotification("Download Failed"); return;});

    await updateOverlayList();
    await genURLS();

    document.getElementById(`${overlay}Status`).style.backgroundColor = "green";

    pushNotification(`Overlay ${nameMap[overlay]} Downloaded`)
}