/** Invoke object for the whole app */
const invoke = window.__TAURI__.core.invoke;

/** Array of overlays */
let overlays = [];

/**Array of available overlays */
let downloadableOverlays = [];

/** Map of the sport titles */
let nameMap;

let firstRun = true;

/**
 * Sets up the app on the first run
 * @async
 * @returns {void}
 */
async function setupApp() {
    if (firstRun) {
        await invoke("get_launch_json");

        downloadableOverlays = await invoke("get_name_map");

        updateOverlayList();

        nameMap = await invoke('get_name_map');
        
        // Check if the app should auto update or auto start the server
        setTimeout(async () => {
            if (await readConfigJSON("autoUpdate") === "true") {
                    downloadFiles("Update");
                }
            if (await readConfigJSON("autoServer") === "true") {
                startServer();
            }
        }, 1000);

        updateAppColor(await readConfigJSON('appColor'), true);
        updateColumnColor(await readConfigJSON('columnColor'), true);
        firstRun = false;

        // Check if the overlay file is empty
        if (overlays.length === 0) {
            pushNotification("No overlays have been found. Please download the overlays.");
        }
    }

    // Used to generate the overlay file if it doesn't exist
    readOverlayJSON("overlay");
}