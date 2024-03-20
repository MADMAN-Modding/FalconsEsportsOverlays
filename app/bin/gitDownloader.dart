import 'dart:io';
import 'package:rw_git/rw_git.dart';

class GitDownloader {
  repoCloner() {
    RwGit rwGit = RwGit();
    rwGit.clone(
        "testing/", "https://github.com/HeinzEric/FalconsEsportsOverlays.git");
  }

  update() {}
}
