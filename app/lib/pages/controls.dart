import 'package:flutter/material.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';

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
      children: [
        Row(
          children: [
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'Left Wins',
                style: TextStyle(color: Colors.white),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsLeft', '0');
                  },
                  child: Text("0")),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsLeft', '1');
                  },
                  child: Text('1')),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsLeft', '2');
                  },
                  child: Text('2')),
            ),
            ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsLeft', '3');
                },
                child: Text('3'))
          ],
        )
      ],
    );
  }
}
