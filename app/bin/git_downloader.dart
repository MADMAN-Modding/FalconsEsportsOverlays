import 'dart:io';
import 'package:rw_git/rw_git.dart';

class GitDownloader {
  RwGit rwGit = RwGit();

  void repoCloner() {
    rwGit.clone(".", "https://github.com/HeinzEric/FalconsEsportsOverlays.git");
  }

  void update() {
    Process.run('git', ['pull']).then((ProcessResult resutls) {
      print(resutls.stdout);
    });
  }
}
