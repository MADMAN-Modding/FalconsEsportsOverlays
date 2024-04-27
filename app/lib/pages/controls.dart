import 'package:flutter/material.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:hexcolor/hexcolor.dart';

class ControlsPage extends StatefulWidget {
  const ControlsPage({super.key});

  @override
  State<StatefulWidget> createState() => _ControlsPage();
}

class _ControlsPage extends State<ControlsPage> {
  String chosenPath = "";

  TextEditingController leftScore = TextEditingController();
  TextEditingController rightScore = TextEditingController();
  TextEditingController leftTeamName = TextEditingController();
  TextEditingController rightTeamName = TextEditingController();
  TextEditingController week = TextEditingController();
  TextEditingController teamColorRight = TextEditingController();
  JSONHandler jsonHandler = JSONHandler();

// create some values

  @override
  Widget build(BuildContext context) {
    // Value initializers
    leftScore.text = jsonHandler.readOverlay('scoreLeft');
    rightScore.text = jsonHandler.readOverlay('scoreRight');
    leftTeamName.text = jsonHandler.readOverlay('teamNameLeft');
    rightTeamName.text = jsonHandler.readOverlay('teamNameRight');
    week.text = jsonHandler.readOverlay('week');
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
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsRight', '0');
                  },
                  child: const Text('0')),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsRight', '1');
                  },
                  child: const Text("1")),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsRight', '2');
                  },
                  child: const Text('2')),
            ),
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
              ),
            ),
            // Right Score
            Padding(
              padding: const EdgeInsets.only(left: 8),
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
                ),
              ),
            )
          ],
        ),
        const Padding(
          padding: EdgeInsets.only(top: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Team Names",
                style: TextStyle(color: Colors.white),
              )
            ],
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 200,
              height: 50,
              child: TextField(
                controller: leftTeamName,
                decoration: const InputDecoration(
                  border: UnderlineInputBorder(),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white, width: 2.0),
                  ),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white, width: 2.0),
                  ),
                  hintText: 'Left Team Name',
                  hintStyle: TextStyle(color: Colors.white),
                ),
                style: const TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
                onChanged: (value) =>
                    jsonHandler.writeOverlay('teamNameLeft', value),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8),
              child: SizedBox(
                width: 200,
                height: 50,
                child: TextField(
                  controller: rightTeamName,
                  decoration: const InputDecoration(
                    border: UnderlineInputBorder(),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    hintText: 'Right Team Name',
                    hintStyle: TextStyle(color: Colors.white),
                  ),
                  style: const TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                  onChanged: (value) =>
                      jsonHandler.writeOverlay('teamNameRight', value),
                ),
              ),
            ),
          ],
        ),
        const Padding(
          padding: EdgeInsets.only(top: 19.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Week",
                style: TextStyle(color: Colors.white),
              )
            ],
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 20,
              height: 50,
              child: TextField(
                controller: week,
                decoration: const InputDecoration(
                  border: UnderlineInputBorder(),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white, width: 2.0),
                  ),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white, width: 2.0),
                  ),
                  hintText: 'Week',
                  hintStyle: TextStyle(color: Colors.white),
                ),
                style: const TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
                onChanged: (value) => jsonHandler.writeOverlay('week', value),
              ),
            )
          ],
        ),
        const Padding(
          padding: EdgeInsets.only(top: 19.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Right Side Color (Not always used)",
                style: TextStyle(color: Colors.white),
              )
            ],
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ColorPicker(
              pickerColor: HexColor(jsonHandler.readOverlay('teamColorRight')),
              onColorChanged: (Color color) {
                jsonHandler.writeOverlay('teamColorRight',
                    "$color".replaceAll("Color(0xff", "").replaceAll(")", ""));
              },
              enableAlpha: false,
              colorPickerWidth: 100,
              labelTypes: const [],
              hexInputBar: true,
              hexInputController: teamColorRight,
            )
          ],
        )
      ],
    );
  }
}
