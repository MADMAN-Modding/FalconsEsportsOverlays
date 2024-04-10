import 'dart:io';

class PHPServerHandler {
  int pid = 0;

  void startServer() {
    Process.run('php', ['-S', '127.0.0.1:8080']).then((ProcessResult result) {
      this.pid = result.pid;
      print(result.pid);
    });
  }

  void stopServer() {
    Process.killPid(pid);
    print(pid);
  }
}
