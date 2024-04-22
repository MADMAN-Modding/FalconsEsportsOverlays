import 'package:falcons_esports_overlays_controller/handlers/php_server_handler.dart';
import 'package:flutter/material.dart';
import '../handlers/git_handler.dart';
import '../handlers/json_handler.dart';

class PHPPage extends StatefulWidget {
  const PHPPage({super.key});

  @override
  State<StatefulWidget> createState() => _PHPPage();
}

class _PHPPage extends State<PHPPage> {
  String chosenPath = "";
  PHPServerHandler php = PHPServerHandler();
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
                      if (await gitHandler
                          .checkRepo(jsonHandler.readConfig("path"))) {
                        php.startServer("");
                      } else if (await gitHandler.checkRepo(
                          "${jsonHandler.readConfig("path")}/FalconsEsportsOverlays")) {
                        php.startServer("FalconsEsportsOverlays");
                      }
                      ;
                    },
                    child: const Text("Start PHP Server")),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ElevatedButton(
                    onPressed: () {
                      php.stopServer();
                    },
                    child: const Text("Stop PHP Server")),
              )
            ],
          )
        ],
      ),
    );
  }
}
