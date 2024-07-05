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

  // Gets the executable directory
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
          // This initializes the config stuff
          .whenComplete(() => File(
                  '$executableDirectory${Constants.slashType}config.json')
              .writeAsString('''
{
    "path": ".",
    "appTheme": "bf0f35",
    "ssbuChecked": true,
    "kartChecked": true,
    "owChecked": true,
    "rlChecked": true,
    "splatChecked": true,
    "valChecked": true,
    "hearthChecked": true,
    "lolChecked": true,
    "chessChecked": true,
    "maddenChecked": true,
    "nba2KChecked": true
}
''').whenComplete(() => configJSON = File(
                      // Reads the json when its done being generated
                      '$executableDirectory${Constants.slashType}config.json')
                  .readAsJsonSync()));
      if (kDebugMode) {
        print("Config Generated");
      }
    }

// This is the same as the config but for the overlay
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
      // Makes sure the overlay isn't being written to
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
      // Tries to prevent the overlay being written to twice, idk if it really made improvements
      isWriting = false;
    } catch (e) {
      // Basically if it fails to write to the overlay and it didn't already exist it will try to make one if the directory is set
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

  // Returns a key's value from the overlay json
  String readOverlay(String key) {
    try {
      return overlayJSON[key].toString().replaceAll(r"\", r"\\");
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }

      // Another check to make the overlay
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

// A method never used to print all the overlay keys
  void getOverlayKeys() {
    for (var key in overlayJSON.keys) {
      if (kDebugMode) {
        print(key);
      }
    }
  }

  // Config methods
  readConfig(String key) {
    try {
      if (key.toLowerCase().contains("checked")) {
        return configJSON[key];
      }
      return configJSON[key].toString().replaceAll(r"\", r"\\");
    } catch (e) {
      if (key == "appTheme") {
        return "bf0f35";
      } else if (key.toLowerCase().contains("path")) {
        return ".";
      } else if (key.toLowerCase().contains("checked")) {
        return true;
      }
    }
  }

// Writes the config
  void writeConfig(String key, var data) {
    // Replaces the supplied key with the supplied value
    configJSON[key] = data;

    // Writes all the values to the config
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
    "appTheme": "${configJSON["appTheme"]}",
    "ssbuChecked": ${configJSON["ssbuChecked"]},
    "kartChecked": ${configJSON["kartChecked"]},
    "owChecked": ${configJSON["owChecked"]},
    "rlChecked": ${configJSON["rlChecked"]},
    "splatChecked": ${configJSON["splatChecked"]},
    "valChecked": ${configJSON["valChecked"]},
    "hearthChecked": ${configJSON["hearthChecked"]},
    "lolChecked": ${configJSON["lolChecked"]},
    "chessChecked": ${configJSON["chessChecked"]},
    "maddenChecked": ${configJSON["maddenChecked"]},
    "nba2kChecked": ${configJSON["nba2KChecked"]}
}
''');
  }

// Makes teh overlay, wahoo
  Future<void> makeOverlay() async {
    // Prevents overwriting

    try {
      // Initializes values
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

      // Loads the overlay
      overlayJSON = File(
              '${readConfig('path')}${Constants.slashType}json${Constants.slashType}overlay.json')
          .readAsJsonSync();
    } catch (e) {
      return;
    }
  }

  Future<void> updateOverlay() async {}
}
