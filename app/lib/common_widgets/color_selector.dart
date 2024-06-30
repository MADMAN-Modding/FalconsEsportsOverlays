import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import '../handlers/json_handler.dart';

class ColorSelector {
  static Widget colorPicker(
      {required Color color,
      required TextEditingController colorController,
      String key = "appTheme",
      bool config = true}) {
    JSONHandler jsonHandler = JSONHandler();

    return ColorPicker(
      pickerColor: color,
      onColorChanged: (Color color) {
        if (config) {
          jsonHandler.writeConfig(
              key, "#${color.toHexString().replaceFirst("FF", "")}");
        } else {
          jsonHandler.writeOverlay(
              key, "#${color.toHexString().replaceFirst("FF", "")}");
        }

        colorController.text = "#${color.toHexString().replaceFirst("FF", "")}";
      },
      enableAlpha: false,
      colorPickerWidth: 100,
      labelTypes: const [],
    );
  }
}
