import 'package:flutter/material.dart';
import '../handlers/json_handler.dart';
import '../constants.dart';

class HTTPPage extends StatefulWidget {
  const HTTPPage({super.key});

  @override
  State<StatefulWidget> createState() => _HTTPPage();
}

class _HTTPPage extends State<HTTPPage> {
  String chosenPath = Constants.codePath;

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
                      Constants.httpHandler.startServer(
                          context, JSONHandler().readConfig("path"));
                    },
                    child: const Text("Start Web Server")),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ElevatedButton(
                    onPressed: () {
                      // Stops the server
                      Constants.httpHandler.stopServer(context);
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
