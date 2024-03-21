import 'dart:io';
import 'package:rw_git/rw_git.dart';
import 'package:simple_git/simple_git.dart';

class GitDownloader {
  RwGit rwGit = RwGit();
  var simpleGit = SimpleGit();
  repoCloner() {
    rwGit.clone(
        "testing/", "https://github.com/HeinzEric/FalconsEsportsOverlays.git");
  }

  update() {
    simpleGit.pull();
  }
}
