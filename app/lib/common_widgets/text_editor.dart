import 'dart:io';

import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;
import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';
import '../handlers/json_handler.dart';

class TextEditor {
  // Static textEditor function
  static Widget textEditor(
      {required double width,
      required double height,
      required TextEditingController controller,
      required String label,
      required double boxHeight,
      bool onChange = false,
      String key = "path"}) {
    double multiplier = constants.Constants.multiplier;

    Widget widget = Column(
      children: [
        SizedBox(height: boxHeight),
        // Since I was having issues with null
        if (label != "") ...[labelMaker(label)],
        Row(
          children: [
            // Sized box with supplied values
            SizedBox(
              width: width * multiplier,
              height: height * (Platform.isAndroid ? 0.78 : 1),
              // Text field for entering values
              child: TextField(
                  controller: controller,
                  // Default decoration used throughout the whole program
                  decoration: InputDecoration(
                      border: const UnderlineInputBorder(),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(
                            color: Colors.white, width: 2.0 * multiplier),
                      ),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(
                            color: Colors.white, width: 2.0 * multiplier),
                      )),
                  // Text style that's the same across the whole page, wahoo
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 17 * multiplier),
                  textAlign: TextAlign.center,
                  // Writes the config with the correct value
                  onChanged: (value) => {
                        if (onChange)
                          {
                            JSONHandler().writeConfig(key, value),
                            constants.Constants.overlayDirectory = value,
                            if (key == "appTheme")
                              {HexColor("#${value.replaceFirst("FF", "")}")}
                          },
                      }),
            )
          ],
        ),
      ],
    );
    // Returns the widget
    return widget;
  }

// Makes a label for what the text field is about (used in controls.dart rn)
  static Widget labelMaker(String label) {
    return Row(
      children: [
        // Calls the default text maker to make the text
        DefaultText.text(label),
      ],
    );
  }
}
