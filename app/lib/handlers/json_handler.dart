import 'dart:convert';
import 'dart:io';
import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;
import 'package:flutter/foundation.dart';
import 'package:json_file/json_file.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';

class JSONHandler {
  // Overlay file initializer
  var overlayJSON;

  // Controller config variables
  var configJSON;

  // Gets the executable directory
  String executableDirectory = constants.Constants.executableDirectory;

  JSONHandler() {
    jsonHandlerInit();
  }

  jsonHandlerInit() async {
    if (Platform.isAndroid) {
      final dir = await getApplicationDocumentsDirectory();

      constants.Constants.executableDirectory = dir.path;
      constants.Constants.overlayDirectory =
          "$executableDirectory${constants.Constants.slashType}FalconsEsportsOverlays-main";

      executableDirectory = constants.Constants.executableDirectory;
    }

    // Try-catch to read config values
    try {
      configJSON = File(
              '$executableDirectory${constants.Constants.slashType}config.json')
          .readAsJsonSync();
    } catch (e) {
      if (kDebugMode) {
        print("Can't find file :( $e \nmaking a new config");
      }
      if (!Platform.isAndroid || await Permission.storage.request().isGranted) {
        File('$executableDirectory${constants.Constants.slashType}config.json')
            .create(recursive: true)
            // This initializes the config stuff
            .whenComplete(() => File(
                    '$executableDirectory${constants.Constants.slashType}config.json')
                .writeAsString('''
{
    "appTheme": "#bf0f35",
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
                        '$executableDirectory${constants.Constants.slashType}config.json')
                    .readAsJsonSync()));
        if (kDebugMode) {
          print("Config Generated");
        }
      }
    }

// This is the same as the config but for the overlay
    try {
      overlayJSON = File(constants.Constants.overlayJSONPath).readAsJsonSync();
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
      overlayJSON[key] = data;
      File(constants.Constants.overlayJSONPath)
          .writeAsStringSync(jsonEncode(overlayJSON));

      // Tries to prevent the overlay being written to twice, idk if it really made improvements
    } catch (e) {
      // Basically if it fails to write to the overlay and it didn't already exist it will try to make one if the directory is set
      if (kDebugMode) {
        print("$e errored here");
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
      try {
        return overlayJSON[key].toString().replaceAll(r"\", r"\\");
      } catch (e) {
        try {
          return overlayJSON[key].toString().replaceAll(r"\", r"\\");
        } catch (e) {
          return "Download Overlays Please";
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
        return "#BF0F35";
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

    File('$executableDirectory${constants.Constants.slashType}config.json')
        .writeAsStringSync(jsonEncode(configJSON));
  }

// Makes the overlay, wahoo
  Future<void> makeOverlay() async {
    // Prevents overwriting

    try {
      // Initializes values
      File(constants.Constants.overlayJSONPath).writeAsStringSync('''
{
    "teamNameLeft": "DC Falcons Red",
    "teamNameRight": "That other team",
    "winsLeft": "0",
    "winsRight": "0",
    "teamColorLeft": "#BE0F32",
    "teamColorRight": "#0120AC",
    "overlay": "kart",
    "week": "0",
    "scoreLeft": "0",
    "scoreRight": "0",
    "playerNamesLeft": "MADMAN-Modding",
    "playerNamesRight": "Check out my Github"
}
''');

      // Loads the overlay
      overlayJSON = File(constants.Constants.overlayJSONPath).readAsJsonSync();
    } catch (e) {
      return;
    }
  }

  Future<void> updateOverlay() async {}
}
