import 'package:flutter/material.dart';
import 'package:falcons_esports_overlays_controller/json_handler.dart';

class ControlsPage extends StatefulWidget {
  const ControlsPage({super.key});

  @override
  State<StatefulWidget> createState() => _ControlsPage();
}

class _ControlsPage extends State<ControlsPage> {
  String chosenPath = "";

  var directory = TextEditingController();
  var jsonHandler = JSONHandler();

  @override
  Widget build(BuildContext context) {

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [Row(
        children: [
          ElevatedButton(onPressed: () {
            jsonHandler.read("overlay");
          }, child: Text("Update Data")),
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
                    onChanged: (value) => chosenPath = value,
                  ),
                ),
        ],
      )],
    );
  }
}
