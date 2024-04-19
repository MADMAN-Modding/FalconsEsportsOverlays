import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:rw_git/rw_git.dart';

class GitDownloader {
  RwGit rwGit = RwGit();

  void repoCloner(path) {
    path ??= FilePicker.platform.getDirectoryPath();

    // Process.run('git', ['clone', 'https://github.com/MADMAN-Modding/FalconsEsportsOverlays.git', '$path/Falcons Esports Overlay']).then((ProcessResult results) {
    //   print(results.stdout);
    //   print(results.stderr);
    //   print(results.pid);
    // });

    rwGit.clone(path, 'https://github.com/MADMAN-Modding/FalconsEsportsOverlays.git');

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

  Future<bool> checkRepo(String path) {
    return rwGit.isGitRepository(path);
  }
}
