import 'package:flutter/material.dart';
import 'package:flutter_popup_card/flutter_popup_card.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_static/shelf_static.dart';
import 'json_handler.dart';

JSONHandler jsonHandler = JSONHandler();

class HTTPHandler {
  late var server;

  Future<void> startServer(BuildContext context) async {
    try {
      this.server = await shelf_io.serve(
          createStaticHandler(jsonHandler.readConfig("path"),
              defaultDocument: 'index.html'),
          'localhost',
          8080);
      this.server = server;
      popUpMaker("Server started", context);
    } catch (e) {
      popUpMaker("Server failed to start or is already running", context);
    }
  }

  void stopServer(BuildContext context) {
    try {
      server.close();
      popUpMaker("Server stopped", context);
    } catch (e) {
      popUpMaker("Failed to stop Server, did you start it?", context);
    }
  }

  Future popUpMaker(String text, BuildContext context) {
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
            padding: const EdgeInsets.all(16.0),
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
