import 'dart:io';
import 'package:archive/archive_io.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart';

class DownloadHandler {
  static download(String path) async {
    if (Platform.isLinux || await Permission.storage.request().isGranted) {
      await http
          .get(Uri.https('codeload.github.com',
              '/MADMAN-Modding/FalconsEsportsOverlays/zip/refs/heads/main'))
          .then((response) {
        File("$path/overlay.zip").writeAsBytesSync(response.bodyBytes);
      });

      extractor(path);

      File("$path/overlay.zip").deleteSync();

      try {
        Directory("$path/FalconsEsportsOverlays").deleteSync(recursive: true);
      } catch (e) {}

      Directory("$path/FalconsEsportsOverlays-main")
          .renameSync("$path/FalconsEsportsOverlays");

      try {
        Directory("$path/FalconsEsportsOverlays-main")
            .deleteSync(recursive: true);
      } catch (e) {}
    }
  }

  static extractor(String path) {
    extractFileToDisk("$path/overlay.zip", path);
  }
}
