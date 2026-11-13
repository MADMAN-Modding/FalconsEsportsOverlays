//! This module is used for handling the data in the config

use super::download_handler::reset_installation;

/// Replaces all installed overlay files with a fresh download and restores the default config
///
/// The current files are only replaced after the new ones are downloaded and verified,
/// so a failed reset leaves everything as it was.
///
/// # Returns
/// * `Ok(())` - Returns an empty `Ok` if no errors occur
/// * `Err(String)` - Returns an error if there are io errors or errors downloading data
#[tauri::command]
pub async fn reset_overlays() -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(reset_installation)
        .await
        .map_err(|e| format!("Reset task failed: {}", e))?
        .map_err(|error| format!("Downloading Error: {}", error))
}
