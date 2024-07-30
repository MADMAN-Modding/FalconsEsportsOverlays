import 'package:falcons_esports_overlays_controller/constants.dart';
import 'package:falcons_esports_overlays_controller/handlers/download_handler.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AndroidDownloadPage extends StatefulWidget {
  const AndroidDownloadPage({super.key});

  @override
  State<StatefulWidget> createState() => _AndroidDownloadPage();
}

class _AndroidDownloadPage extends State<AndroidDownloadPage> {
  late String chosenPath = Constants.executableDir;

  @override
  Widget build(BuildContext context) {
    // Sets the chosen values
    chosenPath = Constants.codePath;

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
                  child: ElevatedButton(
                    onPressed: () async {
                      DownloadHandler.download(chosenPath);
                    },
                    child: const Text('Download Overlays'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Updates the value of the config
  void updateValue(String value) {
    chosenPath = value;
    JSONHandler().writeConfig("path", value);
    if (kDebugMode) {
      print(chosenPath);
    }
  }
}
