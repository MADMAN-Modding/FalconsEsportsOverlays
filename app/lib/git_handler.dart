import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter_popup_card/flutter_popup_card.dart';
import 'package:rw_git/rw_git.dart';

class GitDownloader {
  RwGit rwGit = RwGit();

  void repoCloner(path) {
    path ??= FilePicker.platform.getDirectoryPath();

    print("$path");
    rwGit.clone(
        "$path", "https://github.com/HeinzEric/FalconsEsportsOverlays.git");
  }

  void update() {
    Process.run('git', ['pull']).then((ProcessResult resutls) {
      print(resutls.stdout);
    });
  }

  Future<String?> getPath() async {
    String? path = await FilePicker.platform.getDirectoryPath();

    return path;
  }
}
