import 'dart:io';

import 'package:falcons_esports_overlays_controller/handlers/http_handler.dart';

class Constants {
  static String slashType = Platform.isWindows ? "\\" : "/";

  static HTTPHandler httpHandler = HTTPHandler();

  static String codePath = jsonHandler.readConfig("path");

  static String imagePath = jsonHandler.configJSON("imagePath");
}
