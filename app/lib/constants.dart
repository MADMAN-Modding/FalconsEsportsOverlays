import 'dart:io';

import 'package:falcons_esports_overlays_controller/handlers/http_handler.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
import 'package:hexcolor/hexcolor.dart';

// This file stores a bunch of variables needed across the project
class Constants {
  static JSONHandler jsonHandler = JSONHandler();

  static String slashType = Platform.isWindows ? "\\" : "/";

  static HTTPHandler httpHandler = HTTPHandler();

  static String codePath = jsonHandler.readConfig("path");

  static String imagePath = "$codePath${slashType}Esports-Logo.png";

  static HexColor appTheme = HexColor(jsonHandler.readConfig("appTheme"));

  static bool ssbuChecked = jsonHandler.readConfig("ssbuChecked");

  static bool kartChecked = jsonHandler.readConfig("kartChecked");

  static bool owChecked = jsonHandler.readConfig("owChecked");

  static bool rlChecked = jsonHandler.readConfig("rlChecked");

  static bool splatChecked = jsonHandler.readConfig("splatChecked");

  static bool valChecked = jsonHandler.readConfig("valChecked");

  static bool hearthChecked = jsonHandler.readConfig("hearthChecked");

  static bool lolChecked = jsonHandler.readConfig("lolChecked");

  static bool chessChecked = jsonHandler.readConfig("chessChecked");

  static bool nba2KChecked = jsonHandler.readConfig("nba2KChecked");

  static bool maddenChecked = jsonHandler.readConfig("maddenChecked");
}
