import 'package:falcons_esports_overlays_controller/handlers/notification_handler.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_static/shelf_static.dart';
import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;

class HTTPHandler {
  // Makes the server variable as a var
  late var server;

// Tries to bind an http server to port 8080, if it fails it will tell the user
  Future<void> startServer(BuildContext context) async {
    String path = constants.Constants.overlayDirectory;

    try {
      // Start the server with the updated path
      server = await shelf_io.serve(
          createStaticHandler(path, defaultDocument: 'index.html'),
          '0.0.0.0',
          8080);
      NotificationHandler.notification(context, "Server started");
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
      NotificationHandler.notification(
          context, "Server failed to start or is already running");
    }
  }

// This stops the server and tells the user if it failed or not
  void stopServer(BuildContext context) {
    try {
      server.close();
      server = null;
      NotificationHandler.notification(context, "Server stopped successfully");
    } catch (e) {
      NotificationHandler.notification(
          context, "Failed to stop Server, did you start it?");
    }
  }
}
