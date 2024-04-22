import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:rw_git/rw_git.dart';

class GitHandler {
  RwGit rwGit = RwGit();

  void repoCloner(path) {
    // path ??= FilePicker.platform.getDirectoryPath();

    Process.run('git', [
      'clone',
      'https://github.com/MADMAN-Modding/FalconsEsportsOverlays.git',
      "$path"
    ]);
  }

  void update(String path) {
    Process.run('git', ['pull'],
            workingDirectory: "$path/FalconsEsportsOverlays")
        .then((ProcessResult results) {
      if (kDebugMode) {
        print(results.stdout);
        print(results.stderr);
      }
    });
  }

  Future<String?> getPath() async {
    String? path = await FilePicker.platform.getDirectoryPath();

    return path;
  }

  Future<bool> checkRepo(String path) {
    return rwGit.isGitRepository(path);
  }
}
