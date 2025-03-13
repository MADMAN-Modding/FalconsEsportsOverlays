/**Simply calls the Rust get_overlays_list function adn assigns overlays to the unwrapped Ok(Vec<String>) value*/
function updateOverlayList() {
    invoke("get_overlays_list").then((value) => overlays = value);
}