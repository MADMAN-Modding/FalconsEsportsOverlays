import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_popup_card/flutter_popup_card.dart';
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

    return showPopupCard(
      context: context,
      builder: (context) {
        return PopupCard(
          elevation: 8,
          color: const Color.fromARGB(255, 255, 255, 255),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text('Repository cloned to $path'),
          ),
        );
      },
      offset: const Offset(-16, 70),
      alignment: Alignment.topRight,
      useSafeArea: true,
    );
  }

  void update(String path) {
    Process.run('git', ['pull'], workingDirectory: path)
        .then((ProcessResult results) {
      if (kDebugMode) {
        print(results.stdout);
        print(results.stderr);
      }
    });
  }

  Future<bool> checkRepo(String path) {
    return rwGit.isGitRepository(path);
  }
}
