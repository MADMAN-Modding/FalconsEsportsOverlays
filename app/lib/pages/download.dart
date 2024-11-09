import 'dart:io';
import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;
import 'package:falcons_esports_overlays_controller/handlers/download_handler.dart';
import 'package:falcons_esports_overlays_controller/handlers/notification_handler.dart';
import 'package:flutter/material.dart';

class DownloadPage extends StatefulWidget {
  const DownloadPage({super.key});

  @override
  State<StatefulWidget> createState() => _DownloadPage();
}

class _DownloadPage extends State<DownloadPage> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          // Buttons for cloning and updating the repository
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: buttonAction("Download"),
                ),
                Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: buttonAction("Update"),
                ),
                Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: ElevatedButton(
                      onPressed: () async {
                        NotificationHandler.notification(
                            context, "Starting Reset...");
                        try {
                          File(constants.Constants.imagePath).delete();
                        } catch (e) {}
                        await DownloadHandler.download();

                        NotificationHandler.notification(
                            context, "Overlays Reset");
                      },
                      child: DefaultText.text("Reset Overlays",
                          color: constants.Constants.appTheme)),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buttonAction(String action) {
    return ElevatedButton(
      onPressed: () async {
        NotificationHandler.notification(context, "Starting $action...");

        await DownloadHandler.download();

        NotificationHandler.notification(
            context, "Overlays $action${action.endsWith("e") ? "d" : "ed"}");
      },
      child: DefaultText.text("$action Overlays",
          color: constants.Constants.appTheme),
    );
  }
}
