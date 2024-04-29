// ignore_for_file: prefer_const_literals_to_create_immutables, prefer_const_constructors

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
  TextEditingController teamNameLeft = TextEditingController();
  TextEditingController teamNameRight = TextEditingController();
  TextEditingController week = TextEditingController();
  TextEditingController teamColorRight = TextEditingController();
  TextEditingController playerNamesRight = TextEditingController();
  TextEditingController playerNamesLeft = TextEditingController();
  JSONHandler jsonHandler = JSONHandler();

  Color rightTeamColor = Colors.white;

  // create some values
  @override
  Widget build(BuildContext context) {
    // Value initializers
    leftScore.text = jsonHandler.readOverlay('scoreLeft');
    rightScore.text = jsonHandler.readOverlay('scoreRight');
    teamNameLeft.text = jsonHandler.readOverlay('teamNameLeft');
    teamNameRight.text = jsonHandler.readOverlay('teamNameRight');
    week.text = jsonHandler.readOverlay('week');
    teamColorRight.text = jsonHandler.readOverlay('teamColorRight');
    playerNamesLeft.text = jsonHandler.readOverlay('playerNamesLeft');
    playerNamesRight.text = jsonHandler.readOverlay('playerNamesRight');

    try {
      rightTeamColor = HexColor(jsonHandler.readOverlay('teamColorRight'));
    } catch (e) {
      rightTeamColor = Colors.white;
    }
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
              ),
              onPressed: () {
                jsonHandler.writeOverlay("overlay", "ssbu");
              },
              child: Image.asset(
                'images/SSBU.png',
                width: 100,
                height: 100,
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
              ),
              onPressed: () {
                jsonHandler.writeOverlay("overlay", "kart");
              },
              child: Image.asset(
                'images/Kart.png',
                width: 100,
                height: 100,
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
              ),
              onPressed: () {
                jsonHandler.writeOverlay("overlay", "rocketLeague");
              },
              child: Image.asset(
                'images/RL.png',
                width: 100,
                height: 100,
              ),
            )
          ],
        ),
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
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
            padding: EdgeInsets.only(right: 4),
            child: ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsLeft', '0');
                },
                child: Text("0")),
          ),
          Padding(
            padding: EdgeInsets.only(right: 4),
            child: ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsLeft', '1');
                },
                child: Text('1')),
          ),
          Padding(
            padding: EdgeInsets.only(right: 4),
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
              child: Text('3')),
        ]),
        // Right Team Wins
        Row(
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
              padding: EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsRight', '0');
                  },
                  child: Text('0')),
            ),
            Padding(
              padding: EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsRight', '1');
                  },
                  child: Text("1")),
            ),
            Padding(
              padding: EdgeInsets.only(right: 4),
              child: ElevatedButton(
                  onPressed: () {
                    jsonHandler.writeOverlay('winsRight', '2');
                  },
                  child: Text('2')),
            ),
            ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay('winsRight', '3');
                },
                child: Text('3')),
          ],
        ),
        Padding(
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
                decoration: InputDecoration(
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
                style: TextStyle(color: Colors.white),
                onChanged: (value) =>
                    jsonHandler.writeOverlay('scoreLeft', value),
                textAlign: TextAlign.center,
              ),
            ),
            // Right Score
            Padding(
              padding: EdgeInsets.only(left: 8),
              child: SizedBox(
                height: 50,
                width: 35,
                child: TextField(
                  controller: rightScore,
                  decoration: InputDecoration(
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
                  style: TextStyle(color: Colors.white),
                  onChanged: (value) =>
                      jsonHandler.writeOverlay('scoreRight', value),
                  textAlign: TextAlign.center,
                ),
              ),
            )
          ],
        ),
        Padding(
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
                controller: teamNameLeft,
                decoration: InputDecoration(
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
                style: TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
                onChanged: (value) =>
                    jsonHandler.writeOverlay('teamNameLeft', value),
              ),
            ),
            Padding(
              padding: EdgeInsets.only(left: 8),
              child: SizedBox(
                width: 200,
                height: 50,
                child: TextField(
                  controller: teamNameRight,
                  decoration: InputDecoration(
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
                  style: TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                  onChanged: (value) =>
                      jsonHandler.writeOverlay('teamNameRight', value),
                ),
              ),
            ),
          ],
        ),
        Padding(
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
                decoration: InputDecoration(
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
                style: TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
                onChanged: (value) => jsonHandler.writeOverlay('week', value),
              ),
            )
          ],
        ),
        Padding(
          padding: EdgeInsets.only(top: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Player Names",
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
                controller: playerNamesLeft,
                decoration: InputDecoration(
                  border: UnderlineInputBorder(),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white, width: 2.0),
                  ),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white, width: 2.0),
                  ),
                  hintText: 'Player Names Left',
                  hintStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
                onChanged: (value) =>
                    jsonHandler.writeOverlay('playerNamesLeft', value),
              ),
            ),
            Padding(
              padding: EdgeInsets.only(left: 8),
              child: SizedBox(
                width: 200,
                height: 50,
                child: TextField(
                  controller: playerNamesRight,
                  decoration: InputDecoration(
                    border: UnderlineInputBorder(),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    hintText: 'Right Player Names',
                    hintStyle: TextStyle(color: Colors.white),
                  ),
                  style: TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                  onChanged: (value) =>
                      jsonHandler.writeOverlay('playerNamesRight', value),
                ),
              ),
            ),
          ],
        ),
        Padding(
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
                decoration: InputDecoration(
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
                style: TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
                onChanged: (value) => jsonHandler.writeOverlay('week', value),
              ),
            )
          ],
        ),
        Padding(
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
              pickerColor: rightTeamColor,
              onColorChanged: (Color color) {
                jsonHandler.writeOverlay('teamColorRight',
                    "#$color".replaceAll("Color(0xff", "").replaceAll(")", ""));
                teamColorRight.text =
                    "#$color".replaceAll("Color(0xff", "").replaceAll(")", "");
              },
              enableAlpha: false,
              colorPickerWidth: 100,
              labelTypes: [],
            ),
            SizedBox(
              width: 80,
              height: 50,
              child: TextField(
                controller: teamColorRight,
                decoration: InputDecoration(
                  border: UnderlineInputBorder(),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white, width: 2.0),
                  ),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white, width: 2.0),
                  ),
                  hintText: 'Team Color Right',
                  hintStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
                onChanged: (value) =>
                    jsonHandler.writeOverlay('teamColorRight', value),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
