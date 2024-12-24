async function download_files(action) {
    push_notification(`${action} Overlays`);

    await invoke('download_and_extract');

    push_notification(`${action} Complete`)
}