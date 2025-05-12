use std::process::Command;

use sysinfo::System;
use whoami::username;

/// Gest the current OS
/// 
/// # Returns
/// `String` OS of the device
pub fn get_os() -> String {
    std::env::consts::OS.to_string()
}

/// Gets the name of the current user
/// 
/// # Returns
/// `String` Username of current user
pub fn get_username() -> String {
    username()
}

/// Returns if the requested process is running
/// 
/// # Parameters
/// `process: &str` - Process to search for
/// 
/// # Returns
/// `bool` Is the process running
pub fn get_process_status<'a>(process: &'a str) -> bool {
    for running_process in get_running_processes() {
        if running_process.to_ascii_lowercase().contains(&process) {
            return true;
        }
    }

    false
}

/// Kills the supplied process
/// It will find the first process the matches the inputted name
/// 
/// # Parameters
/// `process: &str` - name of the process to kill 
pub fn kill_process<'a>(process: &'a str) {
    let process = process.to_string();
    let os = get_os();

    match os.as_str() {
        "windows" => {
            let _ = Command::new("taskkill")
                .args(["/IM", &(process + ".exe"), "/F"])
                .status()
                .expect("Failed to execute taskkill");
        }
        "linux" => {
            let _ = Command::new("pkill")
                .arg(process)
                .status()
                .expect("Failed to execute pkill");
        }
        "macos" => {
            let _ = Command::new("pkill")
                .arg(process)
                .status()
                .expect("Failed to execute pkill");
        }
        _ => {}
    }
}


/// Gets the names of all the running processes
/// 
/// # Returns
/// `Vec<String>` Vector of all the processes
fn get_running_processes() -> Vec<String> {
    let mut system = System::new_all();
    system.refresh_all();

    let mut processes: Vec<String> = Vec::new();

    for (_, process) in system.processes() {
        let name = process.name().to_string_lossy().to_string();

        processes.push(name);
    }

    processes
}

// Functions I wrote that I didn't end up needing, keeping them incase I want them latter 

// fn get_process_name<'a>(process: &'a str) -> String {
//     for running_process in get_running_processes() {
//         if running_process.to_lowercase().contains(process) {
//             return running_process.to_string();
//         }
//     }

//     "".to_string()
// }

// fn get_pid<'a>(process: &'a str) -> Pid {
//     let system = System::new_all();

//     for running_process in system.processes() {
//         if running_process
//             .1
//             .name()
//             .to_ascii_lowercase()
//             .to_string_lossy()
//             .contains(process)
//         {
//             return running_process.0.to_owned();
//         }
//     }

//     let pid = Pid::from(0);

//     pid
// }
