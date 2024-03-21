import 'package:rw_git/rw_git.dart';
import 'package:git/git.dart' as git;
import 'package:path/path.dart' as p;

class GitDownloader {
  RwGit rwGit = RwGit();
  String dir = "..";
  void repoCloner() {
    rwGit.clone(
        "testing/", "https://github.com/HeinzEric/FalconsEsportsOverlays.git");
  }

  void update() {}
}
