import 'dart:io';
import 'json_handler.dart';

class PHPServerHandler {
  int pid = 0;

  JSONHandler jsonHandler = JSONHandler();

  void startServer() {
    Process.run('php', ['-S', '127.0.0.1:8080'],
        workingDirectory:
            "${jsonHandler.readConfig('path')}/FalconsEsportsOverlays");
  }

  void stopServer() {
    if (Platform.isLinux) {
      Process.run('pkill', ['php']);
    } else if (Platform.isWindows) {
      Process.run('taskkill', ['/IM', 'php', '/F']);
    }
  }
}
