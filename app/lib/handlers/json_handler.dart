import 'dart:io';
import 'package:falcons_esports_overlays_controller/constants.dart';
import 'package:flutter/foundation.dart';
import 'package:json_file/json_file.dart';

class JSONHandler {
  // Overlay file initializer
  var overlayJSON;

  // Controller config variables
  var configJSON;

  bool isWriting = false;

  String executableDirectory = File(Platform.resolvedExecutable).parent.path;

  JSONHandler() {
    // Try-catch to read config values
    try {
      configJSON = File('$executableDirectory${Constants.slashType}config.json')
          .readAsJsonSync();
    } catch (e) {
      if (kDebugMode) {
        print("Can't find file :( $e \nmaking a new config");
      }
      File('$executableDirectory${Constants.slashType}config.json')
          .create(recursive: true)
          .whenComplete(() => File(
                  '$executableDirectory${Constants.slashType}config.json')
              .writeAsString('''
{
    "path": ".",
    "appTheme": "bf0f35"
}
''').whenComplete(() => configJSON = File(
                      '$executableDirectory${Constants.slashType}config.json')
                  .readAsJsonSync()));

      if (kDebugMode) {
        print("Config Generated");
      }
    }

    try {
      overlayJSON = File(
              '${readConfig('path')}${Constants.slashType}json${Constants.slashType}overlay.json')
          .readAsJsonSync();
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }

      makeOverlay();
    }
  }

  // Overlay methods
  void writeOverlay(String key, String data) {
    try {
      if (!isWriting) {
        isWriting = true;
        overlayJSON[key] = data;
        File('${readConfig('path')}${Constants.slashType}json${Constants.slashType}overlay.json')
            .writeAsStringSync('''
{
    "teamNameLeft": "${overlayJSON['teamNameLeft']}",
    "teamNameRight": "${overlayJSON['teamNameRight']}",
    "winsLeft": "${overlayJSON['winsLeft']}",
    "winsRight": "${overlayJSON['winsRight']}",
    "teamColorLeft": "${overlayJSON['teamColorLeft']}",
    "teamColorRight": "${overlayJSON['teamColorRight']}",
    "overlay": "${overlayJSON['overlay']}",
    "week": "${overlayJSON['week']}",
    "scoreLeft": "${overlayJSON['scoreLeft']}",
    "scoreRight": "${overlayJSON['scoreRight']}",
    "playerNamesLeft": "${overlayJSON['playerNamesLeft']}",
    "playerNamesRight": "${overlayJSON['playerNamesRight']}"
}
''');
      }

      isWriting = false;
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
      try {
        if (readConfig('path') != ".") {
          makeOverlay();
        }
      } catch (e) {
        if (kDebugMode) {
          print(e);
        }
      }
    }
  }

  String readOverlay(String key) {
    try {
      return overlayJSON[key].toString().replaceAll(r"\", r"\\");
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }

      if (readConfig("path") != ".") {
        makeOverlay();
      }

      try {
        return overlayJSON[key].toString().replaceAll(r"\", r"\\");
      } catch (e) {
        try {
          return overlayJSON[key].toString().replaceAll(r"\", r"\\");
        } catch (e) {
          return "Add overlay to the config";
        }
      }
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
      return configJSON[key].toString().replaceAll(r"\", r"\\");
    } catch (e) {
      if (key == "appTheme") {
        return "bf0f35";
      }
      return ".";
    }
  }

  void writeConfig(String key, String data) {
    configJSON[key] = data;

    configJSON["path"] = configJSON["path"]
        .toString()
        .replaceAll(r'\\', r'\')
        .replaceAll(r'\', r'\\');

    configJSON["appTheme"] = configJSON["appTheme"]
        .toString()
        .replaceAll(r'\\', r'\')
        .replaceAll(r'\', r'\\');

    File('$executableDirectory${Constants.slashType}config.json')
        .writeAsStringSync('''
{
    "path": "${configJSON["path"]}",
    "appTheme": "${configJSON["appTheme"]}"
}
''');
  }

  Future<void> makeOverlay() async {
    // Prevents overwriting

    try {
      File('${readConfig('path')}${Constants.slashType}json${Constants.slashType}overlay.json')
          .writeAsStringSync('''
{
    "teamNameLeft": "DC Falcons Red",
    "teamNameRight": "That other team",
    "winsLeft": "0",
    "winsRight": "0",
    "teamColorLeft": "#BE0F32",
    "teamColorRight": "#FFFFFF",
    "overlay": "kart",
    "week": "0",
    "scoreLeft": "0",
    "scoreRight": "0",
    "playerNamesLeft": "MADMAN-Modding",
    "playerNamesRight": "Another player"
}
''');

      overlayJSON = File(
              '${readConfig('path')}${Constants.slashType}json${Constants.slashType}overlay.json')
          .readAsJsonSync();
    } catch (e) {
      return;
    }
  }

  Future<void> updateOverlay() async {}
}
