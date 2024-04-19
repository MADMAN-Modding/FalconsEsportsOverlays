import 'dart:io';

class TestingHandler {
  static void list(String path) {
    Process.run('ls', [path]).then((ProcessResult result) {
      print(result.stdout);
    });
  }
}
