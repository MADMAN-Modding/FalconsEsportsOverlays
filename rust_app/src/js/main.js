// When using the Tauri API npm package:
// import { invoke } from '@tauri-apps/api/core';

// When using the Tauri global script (if not using the npm package)
// Be sure to set `app.withGlobalTauri` in `tauri.conf.json` to true
const invoke = window.__TAURI__.core.invoke;

// Invoke the command
// invoke('my_custom_command');

function download() {
    download_files();
}

function json() {
    test_json()
}