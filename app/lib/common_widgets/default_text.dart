import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;
import 'package:flutter/material.dart';

// All this does is return the default text options, wahoo
class DefaultText {
  static Widget text(String input, {Color color = Colors.white}) {
    double multiplier = constants.Constants.multiplier;

    return Text(
      input,
      style: TextStyle(
          color: color, fontWeight: FontWeight.bold, fontSize: 17 * multiplier),
    );
  }
}
