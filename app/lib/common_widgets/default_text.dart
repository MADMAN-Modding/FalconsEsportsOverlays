import 'package:flutter/material.dart';

// All this does is return the default text options, wahoo
class DefaultText {
  static Widget text(String input) {
    return Text(
      input,
      style: const TextStyle(
          color: Colors.white, fontWeight: FontWeight.bold, fontSize: 17),
    );
  }
}
