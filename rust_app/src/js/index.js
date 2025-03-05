/** Invoke object for the whole app */
const invoke = window.__TAURI__.core.invoke;

/** Global access to the array of overlays */
// let overlays = ["ssbu", "kart", "overwatch", "rocketLeague", "splat", "val", "hearth", "lol", "chess", "madden", "nba2K"];
let overlays;

/** Map of the sport titles */
// let nameMap = {
//     "ssbu": "Super Smash Bros. Ultimate",
//     "kart": "Mario Kart 8 Deluxe",
//     "overwatch": "Overwatch",
//     "rocketLeague": "Rocket League",
//     "splat": "Splatoon",
//     "val": "Valorant",
//     "hearth": "Hearth Stone",
//     "lol": "League of Legends",
//     "chess": "Chess",
//     "madden": "Madden",
//     "nba2K": "NBA 2K"
// };
let nameMap;

let firstRun = true;

/**
 * Sets up the app on the first run
 * @async
 * @returns {void}
 */
async function setupApp() {
    if (firstRun) {
        overlays = await invoke('get_overlays_list');

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

        setAppColor(await readConfigJSON('appColor'), true);
        setColumnColor(await readConfigJSON('columnColor'), true);
        firstRun = false;

        // Check if the overlay file is empty
        if (overlays.length === 0) {
            pushNotification("No overlays have been found. Please download the overlays.");
        }
    }

    // Used to generate the overlay file if it doesn't exist
    readOverlayJSON("overlay");
}