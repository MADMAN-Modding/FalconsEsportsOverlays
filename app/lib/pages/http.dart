import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:flutter/material.dart';
import '../constants.dart' as constants;

class HTTPPage extends StatefulWidget {
  const HTTPPage({super.key});

  @override
  State<StatefulWidget> createState() => _HTTPPage();
}

class _HTTPPage extends State<HTTPPage> {
  String chosenPath = constants.Constants.overlayDirectory;

  var directory = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ElevatedButton(
                    // Asynchronously starts the http server
                    onPressed: () async {
                      constants.Constants.httpHandler.startServer(context);
                    },
                    child: DefaultText.text("Start Web Server",
                        color: constants.Constants.appTheme)),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ElevatedButton(
                    onPressed: () {
                      // Stops the server
                      constants.Constants.httpHandler.stopServer(context);
                    },
                    child: DefaultText.text("Stop Web Server",
                        color: constants.Constants.appTheme)),
              )
            ],
          )
        ],
      ),
    );
  }
}
