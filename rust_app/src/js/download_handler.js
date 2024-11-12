const invoke = window.__TAURI__.core.invoke;
console.log("WHAT");

function download_files() {
    invoke('download_and_extract');
}