//! This module downloads the overlay package and installs it
//!
//! The package is unpacked and checked in a staging directory first, so a failed
//! download or a bad archive never damages the files that are already installed.
use reqwest::blocking::Client;
use std::{
    fs::{self, File},
    io::{self, Cursor},
    path::{Component, Path, PathBuf},
    sync::LazyLock,
};
use zip::ZipArchive;

use crate::{
    constants::{self, get_config_dir_image_path, get_config_dir_overlay_json_path, get_staging_dir},
    handlers::json_handler::{
        default_config_value, default_overlay_json, get_app_version, read_config_json_string,
        reset_config, write_json_file,
    },
};

use super::package_handler::{lock_install, swap_into_place, validated_code_dir};

/// Shared so connections are pooled across downloads
static HTTP_CLIENT: LazyLock<Client> = LazyLock::new(Client::new);

/// Refuses packages that would unpack to more than this many bytes
const MAX_UNPACKED_BYTES: u64 = 512 * 1024 * 1024;

/// Downloads a URL into memory
///
/// # Returns
/// * `Ok(Vec<u8>)` - The body of a successful response
/// * `Err(String)` - A network error or a non-success HTTP status
pub fn download_bytes(url: &str) -> Result<Vec<u8>, String> {
    let response = HTTP_CLIENT
        .get(url)
        .send()
        .map_err(|err| format!("Get Error: {}", err))?
        .error_for_status()
        .map_err(|err| format!("Get Error: {}", err))?;

    response
        .bytes()
        .map(|bytes| bytes.to_vec())
        .map_err(|err| format!("Bytes Error: {}", err))
}

/// Unpacks a zip into `output_dir`, dropping the single top level folder GitHub adds
///
/// # Returns
/// * `Ok(())` - If every entry was written
/// * `Err(String)` - If the archive is invalid, too large or a file can't be written
fn extract_zip(bytes: &[u8], output_dir: &Path) -> Result<(), String> {
    let mut archive =
        ZipArchive::new(Cursor::new(bytes)).map_err(|e| format!("Invalid package: {}", e))?;

    let mut roots: Vec<Option<String>> = Vec::new();
    let mut unpacked: u64 = 0;

    for i in 0..archive.len() {
        let file = archive.by_index(i).map_err(|e| format!("Invalid package: {}", e))?;
        unpacked = unpacked.saturating_add(file.size());

        // Entries with unsafe paths (absolute or containing `..`) have no root
        let root = file
            .enclosed_name()
            .and_then(|path| match path.components().next() {
                Some(Component::Normal(part)) => Some(part.to_string_lossy().into_owned()),
                _ => None,
            });
        roots.push(root);
    }

    if unpacked > MAX_UNPACKED_BYTES {
        return Err("The package is too large".to_string());
    }

    // The top level folder is only removed if every entry sits inside the same one
    let strip: Option<&String> = match roots.first() {
        Some(Some(first)) if roots.iter().all(|r| r.as_ref() == Some(first)) => Some(first),
        _ => None,
    };

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| format!("Invalid package: {}", e))?;

        let Some(enclosed) = file.enclosed_name() else {
            continue;
        };

        let relative = match strip {
            Some(root) => enclosed.strip_prefix(root).unwrap_or(&enclosed).to_path_buf(),
            None => enclosed,
        };

        if relative.as_os_str().is_empty() {
            continue;
        }

        let out_path = output_dir.join(relative);

        if file.is_dir() {
            fs::create_dir_all(&out_path).map_err(|e| format!("Directory Creation Error: {}", e))?;
        } else {
            if let Some(parent) = out_path.parent() {
                fs::create_dir_all(parent).map_err(|e| format!("Directory Creation Error: {}", e))?;
            }

            let mut out_file =
                File::create(&out_path).map_err(|e| format!("File Creation Error: {}", e))?;
            io::copy(&mut file, &mut out_file).map_err(|e| format!("Extract Error: {}", e))?;
        }
    }

    Ok(())
}

/// Downloads a zip containing all of the overlays and installs it
///
/// # Parameters
/// * `preserve` - If true, the current overlay settings and team logo are kept
///
/// # Returns
/// * `Ok(())` - If there are no errors
/// * `Err(String)` - The reason the install failed, the current files are left as they were
#[tauri::command]
pub async fn download_and_extract(preserve: bool) -> Result<(), String> {
    // Blocking network and file work runs on the blocking pool instead of the async executor
    tauri::async_runtime::spawn_blocking(move || {
        install_package(
            &read_config_json_string("overlayURL"),
            &validated_code_dir()?,
            preserve,
        )
    })
    .await
    .map_err(|e| format!("Download task failed: {}", e))?
}

/// Replaces everything installed with a fresh package and restores the default config
///
/// The current files are only replaced once the new package has been downloaded and checked
pub fn reset_installation() -> Result<(), String> {
    let previous = validated_code_dir().ok();
    let target = Path::new(&constants::get_config_dir()).join(default_config_value("overlayDir"));

    install_package(&default_config_value("overlayURL"), &target, false)?;

    // The code directory may have had a different name before the reset
    if let Some(previous) = previous {
        if previous != target {
            let _ = fs::remove_dir_all(previous);
        }
    }

    let _ = fs::remove_file(get_config_dir_overlay_json_path());
    let _ = fs::remove_file(get_config_dir_image_path());

    reset_config();
    Ok(())
}

/// Downloads the package at `url`, checks it and swaps it in as `target`
fn install_package(url: &str, target: &Path, preserve: bool) -> Result<(), String> {
    let bytes = download_bytes(url)?;

    let _guard = lock_install();

    let staging = PathBuf::from(get_staging_dir());
    let _ = fs::remove_dir_all(&staging);
    fs::create_dir_all(&staging).map_err(|e| format!("Directory Creation Error: {}", e))?;

    let result = stage_package(&bytes, &staging, target, preserve)
        .and_then(|_| swap_into_place(&staging, target));

    // Already moved away when the swap worked
    let _ = fs::remove_dir_all(&staging);
    result
}

fn stage_package(bytes: &[u8], staging: &Path, target: &Path, preserve: bool) -> Result<(), String> {
    extract_zip(bytes, staging)?;

    if !staging.join("index.html").is_file() {
        return Err("The package doesn't contain an index.html".to_string());
    }

    let overlay_json = staging.join("json/overlay.json");
    fs::create_dir_all(staging.join("json")).map_err(|e| format!("Directory Creation Error: {}", e))?;

    let current_json = target.join("json/overlay.json");

    // Settings and the logo belong to the user, so they're carried over instead of reset
    if preserve && current_json.is_file() {
        fs::copy(&current_json, &overlay_json).map_err(|e| format!("Copy Error: {}", e))?;
    } else {
        write_json_file(&overlay_json.to_string_lossy(), &default_overlay_json())?;
    }

    let current_logo = target.join("images/Esports-Logo.png");

    if preserve && current_logo.is_file() {
        fs::create_dir_all(staging.join("images")).map_err(|e| format!("Directory Creation Error: {}", e))?;
        fs::copy(&current_logo, staging.join("images/Esports-Logo.png"))
            .map_err(|e| format!("Copy Error: {}", e))?;
    }

    Ok(())
}

/// Turns a version string like `5.0.0` or `v3.3` into a comparable tuple
fn parse_version(version: &str) -> Option<(u64, u64, u64)> {
    let mut parts = version.trim().trim_start_matches('v').split('.');

    let mut next = |required: bool| match parts.next() {
        Some(part) => part.parse::<u64>().ok(),
        None => (!required).then_some(0),
    };

    Some((next(true)?, next(false)?, next(false)?))
}

/// Checks if the data repo lists a newer app version than the one running
#[tauri::command]
pub fn check_for_updates() -> bool {
    let Ok(json) = get_app_version() else {
        return false;
    };

    // Older data files only have `version` (like 3.3) and `subVersion`, newer ones have `semver`
    let latest = match json.get("semver").and_then(|v| v.as_str()) {
        Some(semver) => parse_version(semver),
        None => {
            let version = json.get("version").map(|v| v.to_string());
            let sub_version = json.get("subVersion").map(|v| v.to_string());

            version
                .zip(sub_version)
                .and_then(|(v, s)| parse_version(&format!("{}.{}", v, s)))
        }
    };

    match (latest, parse_version(constants::APP_VERSION)) {
        (Some(latest), Some(current)) => latest > current,
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_versions() {
        assert_eq!(parse_version("5.0.0"), Some((5, 0, 0)));
        assert_eq!(parse_version("v3.3"), Some((3, 3, 0)));
        assert_eq!(parse_version("5"), Some((5, 0, 0)));
        assert_eq!(parse_version("x.1"), None);
        assert_eq!(parse_version(""), None);
    }

    #[test]
    fn older_major_with_higher_minor_is_not_newer() {
        assert!(parse_version("3.9.9") < parse_version("5.0.0"));
        assert!(parse_version("5.0.1") > parse_version("5.0.0"));
    }

    fn zip_with(entries: &[(&str, &str)]) -> Vec<u8> {
        use std::io::Write;

        let mut writer = zip::ZipWriter::new(Cursor::new(Vec::new()));
        let options = zip::write::SimpleFileOptions::default();

        for (name, contents) in entries {
            writer.start_file(*name, options).unwrap();
            writer.write_all(contents.as_bytes()).unwrap();
        }

        writer.finish().unwrap().into_inner()
    }

    fn temp_dir(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("falcons-test-{}-{}", name, std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        dir
    }

    #[test]
    fn extract_strips_the_single_top_level_folder() {
        let dir = temp_dir("strip");
        let bytes = zip_with(&[("Repo-main/index.html", "hi"), ("Repo-main/css/a.css", "b")]);

        extract_zip(&bytes, &dir).unwrap();

        assert_eq!(fs::read_to_string(dir.join("index.html")).unwrap(), "hi");
        assert!(dir.join("css/a.css").is_file());
        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn extract_keeps_paths_when_there_is_no_single_root() {
        let dir = temp_dir("noroot");
        let bytes = zip_with(&[("index.html", "hi"), ("css/a.css", "b")]);

        extract_zip(&bytes, &dir).unwrap();

        assert!(dir.join("index.html").is_file());
        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn extract_skips_entries_that_escape_the_directory() {
        let dir = temp_dir("escape");
        let bytes = zip_with(&[("../evil.txt", "x"), ("ok.txt", "y")]);

        extract_zip(&bytes, &dir).unwrap();

        assert!(dir.join("ok.txt").is_file());
        assert!(!dir.parent().unwrap().join("evil.txt").exists());
        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn extract_rejects_invalid_archives() {
        assert!(extract_zip(b"not a zip", &temp_dir("bad")).is_err());
    }
}
