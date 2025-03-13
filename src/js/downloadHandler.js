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
    if (urls[0] == "NOT_SET") {
        let paths = [];
        let codeDir = await invoke("get_code_dir");
        overlays.forEach(async overlay => {
          paths.push(`${codeDir}/overlays/images/${overlay}.png`);
        });
      
        await genURLS();
    }

    let overlayDownloads = document.getElementById("overlayDownloads");

    for (let i = 0; i < overlays.length; i++) {
        let overlay = overlays[i];

        /** Current URL*/
        let url = urls[i];
      
        overlayDownloads.innerHTML += `
        <div class="col">
        <button id="${overlay}-download" class="overlay-download" onclick="switchOverlay('${overlay}')">
            <img src="${url}" class="img-fluid" alt="${nameMap[overlay]}" />
        </button>
        </div>`
    };
}