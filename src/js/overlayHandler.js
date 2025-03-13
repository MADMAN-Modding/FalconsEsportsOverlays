function updateOverlayList() {
    invoke("get_overlay_list").then((value) => overlays);
}