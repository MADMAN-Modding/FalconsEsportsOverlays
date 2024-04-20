import 'package:falcons_esports_overlays_controller/handlers/testing_handler.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';

class ConfigPage extends StatefulWidget {
  const ConfigPage({super.key});

  @override
  State<StatefulWidget> createState() => _ControlsPage();
}

class _ControlsPage extends State<ConfigPage> {
  String chosenPath = "";

  var directory = TextEditingController();
  var jsonHandler = JSONHandler();

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              SizedBox(
                height: 50,
                width: 50,
                child: TextButton(
                  child: const Icon(
                    Icons.folder,
                    color: Colors.white,
                  ),
                  onPressed: () async {
                    try {
                      chosenPath =
                          (await FilePicker.platform.getDirectoryPath())!;
                      directory.text = chosenPath;
                      jsonHandler.writeConfig('path', chosenPath);
                    } catch (e) {
                      return;
                    }
                  },
                ),
              ),
              SizedBox(
                width: 400,
                child: TextField(
                  controller: directory,
                  decoration: const InputDecoration(
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    hintText: 'Directory Path',
                    hintStyle: TextStyle(color: Colors.white),
                  ),
                  style: const TextStyle(color: Colors.white),
                  onChanged: (value) => jsonHandler.writeConfig("path", value),
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "Make sure this directory cotains the folder \"FalconsEsportsOverlays\"\ndon't select the overlay's folder as the directory.",
                  style: TextStyle(color: Colors.white),
                ),
              )
            ],
          ),
        )
      ],
    );
  }
}
