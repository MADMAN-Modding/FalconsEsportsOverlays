import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;
import 'package:flutter/material.dart';
import '../handlers/json_handler.dart';

class TextEditor {
  static Widget textEditor(
      {required double width,
      required double height,
      required TextEditingController controller,
      required String label,
      required double boxHeight,
      bool onChange = false,
      String key = "path"}) {
    JSONHandler jsonHandler = JSONHandler();

    Widget widget = Column(
      children: [
        SizedBox(height: boxHeight),
        if (label != "") ...[labelMaker(label)],
        Row(
          children: [
            SizedBox(
              width: width,
              height: height,
              child: TextField(
                  controller: controller,
                  decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white, width: 2.0),
                      ),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white, width: 2.0),
                      )),
                  style: const TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                  // Maybe I'll add a key option, but for now it isn't needed
                  onChanged: (value) => {
                        if (onChange) {jsonHandler.writeConfig(key, value)},
                        constants.Constants.codePath = value
                      }),
            )
          ],
        ),
      ],
    );

    return widget;
  }

  static Widget labelMaker(String label) {
    return Row(
      children: [
        Text(
          label,
          style: const TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 17),
        )
      ],
    );
  }
}
