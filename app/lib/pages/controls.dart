import 'package:flutter/material.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';

class ControlsPage extends StatefulWidget {
  const ControlsPage({super.key});

  @override
  State<StatefulWidget> createState() => _ControlsPage();
}

class _ControlsPage extends State<ControlsPage> {
  String chosenPath = "";

  var leftScore = TextEditingController();
  var rightScore = TextEditingController();
  var jsonHandler = JSONHandler();

  @override
  Widget build(BuildContext context) {
    leftScore.text = jsonHandler.readOverlay('scoreLeft');
    rightScore.text = jsonHandler.readOverlay('scoreRight');
    return Column(
      children: [
        const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          // Left Team Wins
          Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Left Team Wins',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ]),
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Padding(
            padding: const EdgeInsets.only(right: 4),
            child: ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsLeft', '0');
                },
                child: const Text("0")),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 4),
            child: ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsLeft', '1');
                },
                child: const Text('1')),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 4),
            child: ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsLeft', '2');
                },
                child: const Text('2')),
          ),
          ElevatedButton(
              onPressed: () {
                jsonHandler.writeOverlay('winsLeft', '3');
              },
              child: const Text('3')),
        ]),
        // Right Team Wins
        const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: EdgeInsets.all(8.0),
              child: Text(
                "Right Team Wins",
                style: TextStyle(color: Colors.white),
              ),
            )
          ],
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsRight', '0');
                },
                child: const Text('0')),
            ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsRight', '1');
                },
                child: const Text("1")),
            ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsRight', '2');
                },
                child: const Text('2')),
            ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsRight', '3');
                },
                child: const Text('3')),
          ],
        ),
        const Padding(
          padding: EdgeInsets.all(8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Left and Right Scores",
                style: TextStyle(color: Colors.white),
              )
            ],
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Left Score
            SizedBox(
                height: 50,
                width: 35,
                child: TextField(
                  controller: leftScore,
                  decoration: const InputDecoration(
                    border: UnderlineInputBorder(),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    hintText: 'Left Score',
                    hintStyle: TextStyle(color: Colors.white),
                  ),
                  style: const TextStyle(color: Colors.white),
                  onChanged: (value) =>
                      jsonHandler.writeOverlay('scoreLeft', value),
                  textAlign: TextAlign.center,
                )),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: SizedBox(
                  height: 50,
                  width: 35,
                  child: TextField(
                    controller: rightScore,
                    decoration: const InputDecoration(
                      border: UnderlineInputBorder(),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white, width: 2.0),
                      ),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white, width: 2.0),
                      ),
                      hintText: 'Right Score',
                      hintStyle: TextStyle(color: Colors.white),
                    ),
                    style: const TextStyle(color: Colors.white),
                    onChanged: (value) =>
                        jsonHandler.writeOverlay('scoreRight', value),
                    textAlign: TextAlign.center,
                  )),
            )
          ],
        )
      ],
    );
  }
}
