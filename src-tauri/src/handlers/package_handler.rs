//! Installs overlay files described by the data repo's `manifest.json`
//!
//! Every file is downloaded to a staging directory and checked against its SHA-256 hash.
//! Nothing in the live directory is touched until all of them are verified.
use std::{
    collections::{HashMap, HashSet},
    fs,
    path::{Component, Path, PathBuf},
    sync::{
        atomic::{AtomicBool, AtomicUsize, Ordering},
        Mutex, MutexGuard,
    },
    thread,
};

use serde::Deserialize;
use sha2::{Digest, Sha256};

use super::{download_handler::download_bytes, json_handler::read_config_json_string};
use crate::constants::{get_backup_dir, get_config_dir, get_staging_dir, DATA_BASE_URL};

/// Highest manifest layout this app understands
const SUPPORTED_SCHEMA: u32 = 1;

const MAX_PARALLEL_DOWNLOADS: usize = 4;

/// Only one install may use the staging directory at a time
static INSTALL_LOCK: Mutex<()> = Mutex::new(());

pub fn lock_install() -> MutexGuard<'static, ()> {
    INSTALL_LOCK.lock().unwrap_or_else(|e| e.into_inner())
}

#[derive(Deserialize, Clone)]
pub struct FileEntry {
    pub path: String,
    pub sha256: String,
    pub size: u64,
}

#[derive(Deserialize)]
pub struct OverlayEntry {
    pub files: Vec<FileEntry>,
}

#[derive(Deserialize)]
pub struct Manifest {
    pub schema: u32,
    /// Files every overlay needs, kept in sync with the data repo
    pub shared: Vec<FileEntry>,
    /// Files only installed when missing, so user changes like the logo are kept
    pub defaults: Vec<FileEntry>,
    pub overlays: HashMap<String, OverlayEntry>,
}

pub fn fetch_manifest() -> Result<Manifest, String> {
    let bytes = download_bytes(&format!("{}/manifest.json", DATA_BASE_URL))?;
    let manifest: Manifest =
        serde_json::from_slice(&bytes).map_err(|e| format!("Invalid manifest: {}", e))?;

    if manifest.schema > SUPPORTED_SCHEMA {
        return Err("The overlay data needs a newer version of the app".to_string());
    }

    Ok(manifest)
}

/// Overlay IDs become file names, so only plain names are accepted
pub fn is_valid_overlay_id(id: &str) -> bool {
    !id.is_empty()
        && id
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '-')
}

/// Turns a manifest path into a path that can't leave the directory it's joined to
fn safe_relative(path: &str) -> Result<PathBuf, String> {
    let relative = Path::new(path);

    let is_plain = !path.is_empty()
        && relative
            .components()
            .all(|c| matches!(c, Component::Normal(_)));

    if is_plain && !path.contains([':', '\\']) {
        Ok(relative.to_path_buf())
    } else {
        Err(format!("Unsafe path in manifest: {}", path))
    }
}

/// The live code directory, checked to be a single folder name inside the config directory
pub fn validated_code_dir() -> Result<PathBuf, String> {
    let name = read_config_json_string("overlayDir");
    let mut components = Path::new(&name).components();

    match (components.next(), components.next()) {
        (Some(Component::Normal(part)), None) if !part.to_string_lossy().starts_with('.') => {
            Ok(Path::new(&get_config_dir()).join(part))
        }
        _ => Err(format!("Invalid overlayDir in config: '{}'", name)),
    }
}

fn sha256_hex(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn matches_entry(path: &Path, entry: &FileEntry) -> bool {
    fs::metadata(path).map(|m| m.len() == entry.size).unwrap_or(false)
        && fs::read(path)
            .map(|bytes| sha256_hex(&bytes).eq_ignore_ascii_case(&entry.sha256))
            .unwrap_or(false)
}

/// Installs the files that are missing or differ from the manifest
fn install_files(files: &[FileEntry]) -> Result<(), String> {
    let _guard = lock_install();
    let code_dir = validated_code_dir()?;

    let mut pending: Vec<(&FileEntry, PathBuf)> = Vec::new();
    for entry in files {
        let relative = safe_relative(&entry.path)?;
        if !matches_entry(&code_dir.join(&relative), entry) {
            pending.push((entry, relative));
        }
    }

    if pending.is_empty() {
        return Ok(());
    }

    let staging = PathBuf::from(get_staging_dir());
    let _ = fs::remove_dir_all(&staging);
    fs::create_dir_all(&staging).map_err(|e| format!("Directory Creation Error: {}", e))?;

    let result = stage_and_commit(&pending, &staging, &code_dir);

    let _ = fs::remove_dir_all(&staging);
    result
}

fn stage_and_commit(
    pending: &[(&FileEntry, PathBuf)],
    staging: &Path,
    code_dir: &Path,
) -> Result<(), String> {
    let next = AtomicUsize::new(0);
    let failed = AtomicBool::new(false);
    let first_error: Mutex<Option<String>> = Mutex::new(None);

    // A few workers pull files off the list until it's empty or one fails
    thread::scope(|scope| {
        for _ in 0..MAX_PARALLEL_DOWNLOADS.min(pending.len()) {
            scope.spawn(|| loop {
                let index = next.fetch_add(1, Ordering::SeqCst);
                if index >= pending.len() || failed.load(Ordering::SeqCst) {
                    return;
                }

                let (entry, relative) = &pending[index];

                if let Err(error) = download_verified(entry, &staging.join(relative)) {
                    failed.store(true, Ordering::SeqCst);
                    first_error
                        .lock()
                        .unwrap_or_else(|e| e.into_inner())
                        .get_or_insert(error);
                    return;
                }
            });
        }
    });

    if let Some(error) = first_error.into_inner().unwrap_or_else(|e| e.into_inner()) {
        return Err(error);
    }

    // Every file is verified, so now they can replace the live ones
    for (_, relative) in pending {
        let destination = code_dir.join(relative);

        if let Some(parent) = destination.parent() {
            fs::create_dir_all(parent).map_err(|e| format!("Directory Creation Error: {}", e))?;
        }

        fs::rename(staging.join(relative), &destination)
            .map_err(|e| format!("Install Error for {}: {}", relative.display(), e))?;
    }

    Ok(())
}

fn download_verified(entry: &FileEntry, destination: &Path) -> Result<(), String> {
    let bytes = download_bytes(&format!("{}/{}", DATA_BASE_URL, entry.path))?;

    if bytes.len() as u64 != entry.size || !sha256_hex(&bytes).eq_ignore_ascii_case(&entry.sha256)
    {
        return Err(format!("{} failed verification", entry.path));
    }

    if let Some(parent) = destination.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Directory Creation Error: {}", e))?;
    }

    fs::write(destination, bytes).map_err(|e| format!("File Write Error: {}", e))
}

/// The overlays the data repo currently publishes files for, sorted by name
pub fn available_overlays() -> Result<Vec<String>, String> {
    let mut names: Vec<String> = fetch_manifest()?.overlays.into_keys().collect();
    names.sort();
    Ok(names)
}

/// Installs an overlay and the files it depends on
pub fn install_overlay(overlay: &str) -> Result<(), String> {
    if !is_valid_overlay_id(overlay) {
        return Err(format!("Invalid overlay name: {}", overlay));
    }

    let manifest = fetch_manifest()?;
    let entry = manifest
        .overlays
        .get(overlay)
        .ok_or_else(|| format!("{} is not available yet", overlay))?;

    // The shared files come along so an overlay never depends on a stale copy
    let files: Vec<FileEntry> = manifest
        .shared
        .iter()
        .chain(entry.files.iter())
        .cloned()
        .collect();

    install_files(&files)
}

/// Brings the shared files up to date and adds the default files that are missing
pub fn sync_shared() -> Result<(), String> {
    let manifest = fetch_manifest()?;

    let code_dir = validated_code_dir()?;
    let mut files = manifest.shared.clone();

    for default in &manifest.defaults {
        if !code_dir.join(safe_relative(&default.path)?).exists() {
            files.push(default.clone());
        }
    }

    install_files(&files)
}

/// Deletes an overlay's files, keeping any that shared files or other installed overlays use
pub fn remove_overlay(overlay: &str) -> Result<(), String> {
    if !is_valid_overlay_id(overlay) {
        return Err(format!("Invalid overlay name: {}", overlay));
    }

    let _guard = lock_install();
    let code_dir = validated_code_dir()?;

    let paths: Vec<String> = match fetch_manifest() {
        Ok(manifest) => {
            let Some(entry) = manifest.overlays.get(overlay) else {
                return Err(format!("{} is not available", overlay));
            };

            let mut keep: HashSet<&str> = manifest
                .shared
                .iter()
                .chain(manifest.defaults.iter())
                .map(|f| f.path.as_str())
                .collect();

            for (id, other) in &manifest.overlays {
                if id != overlay && code_dir.join(format!("overlays/{}.html", id)).exists() {
                    keep.extend(other.files.iter().map(|f| f.path.as_str()));
                }
            }

            entry
                .files
                .iter()
                .filter(|f| !keep.contains(f.path.as_str()))
                .map(|f| f.path.clone())
                .collect()
        }
        // Offline, fall back to the standard file layout
        Err(_) => vec![
            format!("overlays/{}.html", overlay),
            format!("css/{}.css", overlay),
            format!("js/{}.js", overlay),
            format!("overlays/images/{}.png", overlay),
        ],
    };

    for path in paths {
        match fs::remove_file(code_dir.join(safe_relative(&path)?)) {
            Ok(_) => (),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => (),
            Err(e) => return Err(format!("Delete Error for {}: {}", path, e)),
        }
    }

    Ok(())
}

/// Replaces `live` with `staging`, restoring the old directory if the swap fails
pub fn swap_into_place(staging: &Path, live: &Path) -> Result<(), String> {
    let backup = PathBuf::from(get_backup_dir());
    let _ = fs::remove_dir_all(&backup);

    let had_live = live.exists();

    if had_live {
        fs::rename(live, &backup).map_err(|e| format!("Unable to back up the current files: {}", e))?;
    }

    if let Err(e) = fs::rename(staging, live) {
        if had_live {
            let _ = fs::rename(&backup, live);
        }
        return Err(format!("Install Error: {}", e));
    }

    let _ = fs::remove_dir_all(&backup);
    Ok(())
}

/// Restores the previous files if the app closed in the middle of a swap
pub fn recover_interrupted_install() {
    let _guard = lock_install();

    if let Ok(live) = validated_code_dir() {
        let backup = PathBuf::from(get_backup_dir());

        if !live.exists() && backup.exists() {
            let _ = fs::rename(&backup, &live);
        }
    }

    let _ = fs::remove_dir_all(get_staging_dir());
    let _ = fs::remove_dir_all(get_backup_dir());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn safe_relative_accepts_plain_paths() {
        assert!(safe_relative("overlays/kart.html").is_ok());
        assert!(safe_relative("css/ethnocentric.woff").is_ok());
    }

    #[test]
    fn safe_relative_rejects_escapes() {
        for path in ["", "../x", "a/../../x", "/etc/passwd", "C:\\x", "a\\b", "./a"] {
            assert!(safe_relative(path).is_err(), "{path} should be rejected");
        }
    }

    #[test]
    fn overlay_ids_are_plain_names() {
        assert!(is_valid_overlay_id("nba2K"));
        assert!(is_valid_overlay_id("kart_one-screen"));
        assert!(!is_valid_overlay_id(""));
        assert!(!is_valid_overlay_id("../kart"));
        assert!(!is_valid_overlay_id("a/b"));
    }

    #[test]
    fn sha256_matches_known_value() {
        assert_eq!(
            sha256_hex(b"abc"),
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
    }
}
