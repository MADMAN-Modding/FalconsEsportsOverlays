import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:json_file/json_file.dart';

class JSONHandler {
  //
  var overlayJSON;

  // Controller config variables
  var configJSON;

  JSONHandler() {
    // Try-catch to read config values
    try {
      configJSON = File('config.json').readAsJsonSync();
    } catch (e) {
      if (kDebugMode) {
        print("Can't find file :( $e \nmaking a new config");
      }
      File('config.json').create(recursive: true).whenComplete(() =>
          File('config.json')
              .writeAsString('''{\n  "path": "."\n  }''').whenComplete(
                  () => configJSON = File('config.json').readAsJsonSync()));

      if (kDebugMode) {
        print("Config Generated");
      }
    }
  }

  // Overlay methods
  void writeOverlay(String key, String data) {
    var fileWrite = overlayJSON.openWrite();

    overlayJSON[key] = data;

    fileWrite.write('''{\n  "$key": "$data"\n }''');
  }

  String readOverlay(String key) {
    return overlayJSON[key];
  }

  void getOverlayKeys() {
    for (var key in overlayJSON.keys) {
      if (kDebugMode) {
        print(key);
      }
    }
  }

  // Config methods
  String readConfig(String key) {
    try {
      return configJSON[key];
    } catch (e) {
      return ".";
    }
  }

  void writeConfig(String key, String data) {
    // var fileWrite = configJSON.openWrite();

    File('config.json').writeAsStringSync('''{\n "$key": "$data"}''');

    // fileWrite.write('{"$key": "$data"}');
  }
}
