/**
 * Calls the Rust function to get the list of OBS scenes
 * 
 * @async
 */
async function getSceneList() {
    let scenes = await invoke("get_scenes");
    
    return scenes;
}

/** Injects the desired scene with the overlay browser
 * 
 * @returns {Promise<void>}
 * @async
 */
async function injectOBSScene() {
    let scene = document.getElementById("scenes").value;

    if (scene == "Select a Scene") {
        pushNotification("Invalid Selection");
        return;
    }
    
    invoke("inject", {"scene" : scene}).then((value) => pushNotification(value));
}