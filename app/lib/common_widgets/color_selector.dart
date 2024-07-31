import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import '../handlers/json_handler.dart';
import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;

class ColorSelector {
  // static function for making color pickers
  static Widget colorPicker(
      // Values to be passed in cause dart is cool with how i handles those
      // :sunglasses: (pretend that worked)
      {required Color color,
      required TextEditingController colorController,
      String key = "appTheme",
      bool config = true}) {
    double multiplier = constants.Constants.multiplier;
    return ColorPicker(
      pickerColor: color,
      onColorChanged: (Color color) {
        // Determines which json to write to
        if (config) {
          JSONHandler().writeConfig(
              // Removes the opacity values cause css doesn't like them
              key,
              "#${color.toHexString().replaceFirst("FF", "")}");
        } else {
          JSONHandler().writeOverlay(
              key, "#${color.toHexString().replaceFirst("FF", "")}");
        }

        // Sets the value of the supplied text controller
        colorController.text = "#${color.toHexString().replaceFirst("FF", "")}";
      },
      // Makes is so there isn't as many options to pick from
      enableAlpha: false,
      colorPickerWidth: 80 * multiplier,
      labelTypes: const [],
    );
  }
}
