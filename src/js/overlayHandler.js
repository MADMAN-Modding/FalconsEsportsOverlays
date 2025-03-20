/**Simply calls the Rust get_overlays_list function adn assigns overlays to the unwrapped Ok(Vec<String>) value
 * 
 * @async
*/
async function updateOverlayList() {
    pushNotification("Generating Overlay List...");
    await invoke("get_overlays_list").then((value) => overlays = value);
    pushNotification("Generated Overlay List");
}

/**
 * Deletes the selected overlay
 * @param {String} id - ID of the overlay to delete
 * @async 
 */
async function deleteOverlay(id) {
    await invoke("delete_selected_overlay", { "overlay": id })
        .catch((error) => pushNotification(`Failed to remove ${nameMap[id]}\n\n${error}`));

    await updateOverlayList();
    await genURLS();

    pushNotification(`Removed ${nameMap[id]}`)
}