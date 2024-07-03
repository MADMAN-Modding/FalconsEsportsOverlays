import 'dart:io';
import 'package:falcons_esports_overlays_controller/handlers/notification_handler.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:rw_git/rw_git.dart';

class GitHandler {
  // Object that is used only to check is a folder is a git repo
  RwGit rwGit = RwGit();

// Clones the repo for this project
  Future<Future> repoCloner(path, BuildContext context) async {
// Wait for the process to finish the notification is sent at the right time
    await Process.run('git', [
      'clone',
      'https://github.com/MADMAN-Modding/FalconsEsportsOverlays.git',
      "$path"
    ]);

// Sends a notification to the user once the repo is cloned
    return NotificationHandler.notification(
        context, "Repository cloned to $path");
  }

// Makes sure that the folder is a git repo and then it will pull the latest from GitHub
  Future<void> update(String path, BuildContext context) async {
    await Process.run('git', ['pull'], workingDirectory: path)
        .then((ProcessResult results) {
      if (kDebugMode) {
        print(results.stdout);
        print(results.stderr);
      }
      // Sends a notification to the user with the updated files, kinda a big output if they haven't updated in a while but hey, it lets them know
      return NotificationHandler.notification(
          context, "Repository Updated\nOutput:\n${results.stdout}");
    });
  }

// Function that checks the repo
  Future<bool> checkRepo(String path) {
    return rwGit.isGitRepository(path);
  }
}
