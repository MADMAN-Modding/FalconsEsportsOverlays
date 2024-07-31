import 'dart:io';

import 'package:flutter/material.dart';

// All this does is return the default text options, wahoo
class DefaultText {
  static Widget text(String input) {
    double multiplier = Platform.isAndroid ? 0.8 : 1;

    return Text(
      input,
      style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 17 * multiplier),
    );
  }
}
