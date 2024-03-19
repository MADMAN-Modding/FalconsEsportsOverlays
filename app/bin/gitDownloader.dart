import 'dart:io';

class gitDownloader {
  gitDownloader() {
    Process.run('git',
        ['clone https://github.com/HeinzEric/FalconsEsportsOverlays.git']);
  }

  download() {}

  update() {}
}
