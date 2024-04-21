import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:rw_git/rw_git.dart';

class GitDownloader {
  RwGit rwGit = RwGit();

  void repoCloner(path) {
    path ??= FilePicker.platform.getDirectoryPath();

    rwGit.clone(
        path, 'https://github.com/MADMAN-Modding/FalconsEsportsOverlays.git');
  }

  void update() {
    Process.run('git', ['pull']).then((ProcessResult results) {
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
    return rwGit.isGitRepository("$path/FalconsEsportsOverlays");
  }
}
