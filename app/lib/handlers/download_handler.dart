import 'dart:io';
import 'package:http/http.dart' as http;

class DownloadHandler {
  static download(String path) {
    http
        .get(Uri.https('codeload.github.com',
            '/MADMAN-Modding/FalconsEsportsOverlays/zip/refs/heads/main'))
        .then((response) {
      File(path).writeAsBytesSync(response.bodyBytes);
      print(path);
    });
  }
}
