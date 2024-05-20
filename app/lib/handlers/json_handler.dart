import 'dart:io';
import 'package:falcons_esports_overlays_controller/constants.dart';
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
    "phpPath": "php"
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
      print(e);
    }
  }

  // Overlay methods
  void writeOverlay(String key, String data) {
    try {
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
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
      try {
      if (readConfig('path') != ".") {
        writeOverlay("teamNameLeft", "DC Falcons Red");
        writeOverlay("teamNameRight", "That other team");
        writeOverlay("winsLeft", "0");
        writeOverlay("winsRight", "0");
        writeOverlay("teamColorLeft", "#BE0F32");
        writeOverlay("teamColorRight", "#FFFFFF");
        writeOverlay("overlay", "kart");
        writeOverlay("scoreLeft", "0");
        writeOverlay("scoreRight", "0");
        writeOverlay("playerNamesLeft", "MADMAN-Modding");
        writeOverlay("playerNamesRight", "Input Name");
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
      return configJSON[key].toString().replaceAll(r"\", r"\\");
    } catch (e) {
      return ".";
    }
  }

  void writeConfig(String key, String data) {
    configJSON[key] = data;

    configJSON["path"] = configJSON["path"]
        .toString()
        .replaceAll(r'\\', r'\')
        .replaceAll(r'\', r'\\');
    configJSON["phpPath"] = configJSON["phpPath"]
        .toString()
        .replaceAll(r'\\', r'\')
        .replaceAll(r'\', r'\\');

    File('$executableDirectory${Constants.slashType}config.json')
        .writeAsStringSync('''
{
    "path": "${configJSON["path"]}",
    "phpPath": "${configJSON["phpPath"]}"
}
''');
  }
}
