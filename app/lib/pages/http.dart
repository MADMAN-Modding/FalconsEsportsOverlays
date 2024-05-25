import 'package:falcons_esports_overlays_controller/constants.dart';
import 'package:falcons_esports_overlays_controller/handlers/http_handler.dart';
import 'package:falcons_esports_overlays_controller/handlers/php_server_handler.dart';
import 'package:flutter/material.dart';
import '../handlers/git_handler.dart';
import '../handlers/json_handler.dart';
import '../main.dart';
import '../constants.dart' as constants;

class HTTPPage extends StatefulWidget {
  const HTTPPage({super.key});

  @override
  State<StatefulWidget> createState() => _HTTPPage();
}

class _HTTPPage extends State<HTTPPage> {
  String chosenPath = "";
  GitHandler gitHandler = GitHandler();
  JSONHandler jsonHandler = JSONHandler();

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
                    onPressed: () async {
                      constants.Constants.httpHandler.startServer(context);
                    },
                    child: const Text("Start Web Server")),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ElevatedButton(
                    onPressed: () {
                      constants.Constants.httpHandler.stopServer(context);
                    },
                    child: const Text("Stop Web Server")),
              )
            ],
          )
        ],
      ),
    );
  }
}
