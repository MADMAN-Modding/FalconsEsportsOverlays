import 'dart:io';
import 'package:falcons_esports_overlays_controller/handlers/notification_handler.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:rw_git/rw_git.dart';

class GitHandler {
  RwGit rwGit = RwGit();

  Future<Future> repoCloner(path, BuildContext context) async {
    // path ??= FilePicker.platform.getDirectoryPath();

    await Process.run('git', [
      'clone',
      'https://github.com/MADMAN-Modding/FalconsEsportsOverlays.git',
      "$path"
    ]);

    return NotificationHandler.notification(
        context, "Repository cloned to $path");
  }

  Future<void> update(String path, BuildContext context) async {
    await Process.run('git', ['pull'], workingDirectory: path)
        .then((ProcessResult results) {
      if (kDebugMode) {
        print(results.stdout);
        print(results.stderr);
      }
      return NotificationHandler.notification(
          context, "Repository Updated\nOutput:\n${results.stdout}");
    });
  }

  Future<bool> checkRepo(String path) {
    return rwGit.isGitRepository(path);
  }
}
