import 'dart:io';
import 'package:rw_git/rw_git.dart';
import 'package:git/git.dart' as git;
import 'package:path/path.dart' as p;

class GitDownloader {
  RwGit rwGit = RwGit();
  var dir = Directory("testing/");
  
  void repoCloner() {
    rwGit.clone(
        "testing/", "https://github.com/HeinzEric/FalconsEsportsOverlays.git");
  }

  void update() {
    Directory.current = dir.path;
    Process.run('git', ['pull']).then((ProcessResult resutls){
      print(resutls.stdout);
    });
  }
}
