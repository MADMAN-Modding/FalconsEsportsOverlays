import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:json_file/json_file.dart';

class JSONHandler {
  //
  var overlayJSON;

  // Controller config variables
  var configJSON;

  String executableDirectory = File(Platform.resolvedExecutable).parent.path;

  JSONHandler() {
    // Try-catch to read config values

    print(executableDirectory);
    try {
      configJSON = File('$executableDirectory/config.json').readAsJsonSync();
    } catch (e) {
      if (kDebugMode) {
        print("Can't find file :( $e \nmaking a new config");
      }
      File('$executableDirectory/config.json')
          .create(recursive: true)
          .whenComplete(() => File('$executableDirectory/config.json')
              .writeAsString('''
{
    "path": ".",
    "phpPath": "php"
}
''').whenComplete(() => configJSON = File(
                      '$executableDirectory/config.json')
                  .readAsJsonSync()));

      if (kDebugMode) {
        print("Config Generated");
      }
    }

    try {
      overlayJSON =
          File('${readConfig('path')}/json/overlay.json').readAsJsonSync();
    } catch (e) {
      print(e);
    }
  }

  // Overlay methods
  void writeOverlay(String key, String data) {
    try {
      overlayJSON[key] = data;
      File('${readConfig('path')}/json/overlay.json').writeAsStringSync('''
{
    "teamNameLeft": "${overlayJSON['teamNameLeft']}",
    "teamNameRight": "${overlayJSON['teamNameRight']}",
    "winsLeft": "${overlayJSON['winsLeft']}",
    "winsRight": "${overlayJSON['winsRight']}",
    "teamColorRight": "${overlayJSON['teamColorRight']}",
    "overlay": "${overlayJSON['overlay']}",
    "week": "${overlayJSON['week']}",
    "scoreLeft": "${overlayJSON['scoreLeft']}",
    "scoreRight": "${overlayJSON['scoreRight']}",
    "playerNamesLeft": "${overlayJSON['playerNamesLeft']}",
    "playerNamesRight": "${overlayJSON['playerNamesRight']}"
}
''');
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  String readOverlay(String key) {
    try {
      return overlayJSON[key];
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
      return "Add overlay to the config";
    }
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
    configJSON[key] = data;

    File('$executableDirectory/config.json').writeAsStringSync('''
{
    "path": "${configJSON["path"]}",
    "phpPath": "${configJSON["phpPath"]}"
}
''');
  }
}
