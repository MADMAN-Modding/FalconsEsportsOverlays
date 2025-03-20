/**Simply calls the Rust get_overlays_list function adn assigns overlays to the unwrapped Ok(Vec<String>) value*/
function updateOverlayList() {
    invoke("get_overlays_list").then((value) => overlays = value);
}

/**
 * Deletes the selected overlay
 * @param {String} id - ID of the overlay to delete
 * @async 
 */
async function deleteOverlay(id) {
    await invoke("delete_selected_overlay", { "overlay": id })
        .then(() => pushNotification(`Removed ${nameMap[id]}`))
        .catch((error) => pushNotification(`Failed to remove ${nameMap[id]}\n\n${error}`));

    updateOverlayList();
    genURLS();
}