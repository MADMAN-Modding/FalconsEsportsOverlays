import 'dart:io';
import 'package:archive/archive_io.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart';
import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;

class DownloadHandler {
  static download(String path) async {
    String slashType = constants.Constants.slashType;
    if (!Platform.isAndroid || await Permission.storage.request().isGranted) {
      await http
          .get(Uri.https('codeload.github.com',
              '/MADMAN-Modding/FalconsEsportsOverlays/zip/refs/heads/main'))
          .then((response) {
        File("$path${slashType}overlay.zip")
            .writeAsBytesSync(response.bodyBytes);
      });

      extractor(path);

      File("$path${slashType}overlay.zip").deleteSync();

      try {
        Directory("$path${slashType}FalconsEsportsOverlays")
            .deleteSync(recursive: true);
      } catch (e) {}

      Directory("$path${slashType}FalconsEsportsOverlays-main")
          .renameSync("$path${slashType}FalconsEsportsOverlays");

      try {
        Directory("$path${slashType}FalconsEsportsOverlays-main")
            .deleteSync(recursive: true);
      } catch (e) {}

      try {
        Directory("$path${slashType}FalconsEsportsOverlays${slashType}app")
            .deleteSync(recursive: true);
      } catch (e) {}
    }
  }

  static extractor(String path) {
    String slashType = constants.Constants.slashType;

    extractFileToDisk("$path${slashType}overlay.zip", path);
  }
}
