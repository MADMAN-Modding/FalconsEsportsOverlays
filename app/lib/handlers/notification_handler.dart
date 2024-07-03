import 'package:flutter/material.dart';
import 'package:flutter_popup_card/flutter_popup_card.dart';

class NotificationHandler {
  static Future notification(BuildContext context, String text) {
    // Makes a popup card with the input text in a locked position
    return showPopupCard(
      context: context,
      builder: (context) {
        return PopupCard(
          elevation: 8,
          color: const Color.fromARGB(255, 255, 255, 255),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Text(text),
          ),
        );
      },
      offset: const Offset(-16, 70),
      alignment: Alignment.topRight,
      useSafeArea: true,
    );
  }
}
