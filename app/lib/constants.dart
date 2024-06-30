import 'dart:io';

import 'package:falcons_esports_overlays_controller/handlers/http_handler.dart';
import 'package:hexcolor/hexcolor.dart';

class Constants {
  static String slashType = Platform.isWindows ? "\\" : "/";

  static HTTPHandler httpHandler = HTTPHandler();

  static String codePath = jsonHandler.readConfig("path");

  static String imagePath = "$codePath${slashType}Esports-Logo.png";

  static HexColor appTheme = HexColor("012345");

  // static HexColor appTheme = HexColor(jsonHandler.readConfig("appTheme"));
}
