import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:hexcolor/hexcolor.dart';
import '../handlers/json_handler.dart';

class ControlsPage extends StatefulWidget {
  const ControlsPage({super.key});

  @override
  State<StatefulWidget> createState() => _ControlsPageState();
}

class _ControlsPageState extends State<ControlsPage> {
  final TextEditingController scoreLeft = TextEditingController();
  final TextEditingController scoreRight = TextEditingController();
  final TextEditingController teamNameLeft = TextEditingController();
  final TextEditingController teamNameRight = TextEditingController();
  final TextEditingController week = TextEditingController();
  final TextEditingController teamColorRight = TextEditingController();
  final TextEditingController teamColorLeft = TextEditingController();
  final TextEditingController playerNamesRight = TextEditingController();
  final TextEditingController playerNamesLeft = TextEditingController();
  final JSONHandler jsonHandler = JSONHandler();

  Color teamColorLeftDefault = const Color.fromRGBO(190, 15, 50, 1);
  Color teamColorRightDefault = Colors.white;

  @override
  void initState() {
    super.initState();

    // Initialize controller values
    scoreLeft.text = jsonHandler.readOverlay('scoreLeft');
    scoreRight.text = jsonHandler.readOverlay('scoreRight');
    teamNameLeft.text = jsonHandler.readOverlay('teamNameLeft');
    teamNameRight.text = jsonHandler.readOverlay('teamNameRight');
    week.text = jsonHandler.readOverlay('week');
    teamColorLeft.text = jsonHandler.readOverlay('teamColorLeft');
    teamColorRight.text = jsonHandler.readOverlay('teamColorRight');
    playerNamesLeft.text = jsonHandler.readOverlay('playerNamesLeft');
    playerNamesRight.text = jsonHandler.readOverlay('playerNamesRight');

    try {
      teamColorLeftDefault = HexColor(jsonHandler.readOverlay("teamColorLeft"));
      teamColorRightDefault =
          HexColor(jsonHandler.readOverlay("teamColorRight"));
    } catch (e) {
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height,
      child: Column(
        children: [
          // Overlay Switchers
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              buildOverlayButton('ssbu', 'images/SSBU.png'),
              buildOverlayButton('kart', 'images/Kart.png'),
              buildOverlayButton('overwatch', 'images/Overwatch.png'),
              buildOverlayButton('rocketLeague', 'images/RL.png'),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              buildTeamColumn(
                teamSide: "Left",
                controllers: [scoreLeft, playerNamesLeft, teamNameLeft],
                widths: [40, 260, 260],
                heights: [40, 40, 40],
                labels: ["Score", "Player Names", "Team Name"],
                colorController: teamColorLeft,
                sideColor: teamColorLeftDefault,
              ),
              buildMiddleColumn(),
              buildTeamColumn(
                teamSide: "Right",
                controllers: [scoreRight, playerNamesRight, teamNameRight],
                widths: [40, 260, 260],
                heights: [40, 40, 40],
                labels: ["Score", "Player Names", "Team Name"],
                colorController: teamColorRight,
                sideColor: teamColorRightDefault,
              )
            ],
          )
        ],
      ),
    );
  }

  Widget buildOverlayButton(String overlay, String imagePath) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        shadowColor: Colors.transparent,
      ),
      onPressed: () {
        jsonHandler.writeOverlay("overlay", overlay);
      },
      child: Image.asset(
        imagePath,
        width: 100,
        height: 100,
      ),
    );
  }

  Widget textEditor({
    required double width,
    required double height,
    required TextEditingController controller,
    required String label,
  }) {
    return Column(
      children: [
        const SizedBox(height: 5),
        Row(
          children: [
            Text(
              label,
              style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 17),
            )
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            SizedBox(
              width: width,
              height: height,
              child: TextField(
                controller: controller,
                decoration: const InputDecoration(
                    border: UnderlineInputBorder(),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white, width: 2.0),
                    )),
                style: const TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
              ),
            )
          ],
        ),
      ],
    );
  }

  Widget scoreButton(
      {required String text, required String jsonKey, required int value}) {
    return Row(
      children: [
        Padding(
            padding: const EdgeInsets.only(right: 4),
            child: ElevatedButton(
              onPressed: () {
                jsonHandler.writeOverlay(jsonKey, "$value");
              },
              child: Text(text),
            ))
      ],
    );
  }

  Widget buildTeamColumn(
      {required String teamSide,
      required List<TextEditingController> controllers,
      required List<double> widths,
      required List<double> heights,
      required List<String> labels,
      required TextEditingController colorController,
      required Color sideColor}) {
    List<Widget> winButtons = [];
    for (int i = 0; i < 4; i++) {
      winButtons
          .add(scoreButton(text: "$i", jsonKey: "wins$teamSide", value: i));
    }
    List<Widget> textEditors = [];

    for (int i = 0; i < controllers.length; i++) {
      textEditors.add(
        textEditor(
          width: widths[i],
          height: heights[i],
          controller: controllers[i],
          label: labels[i],
        ),
      );
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              "$teamSide Team",
              style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 20),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Text(
          "$teamSide Wins",
          style: const TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 17),
        ),
        const SizedBox(height: 10),
        Row(children: winButtons),
        Column(children: textEditors),
        const SizedBox(height: 15),
        Column(
          children: [
            const Text("Team Color",
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 20)),
            ColorPicker(
              pickerColor: sideColor,
              onColorChanged: (Color color) {
                jsonHandler.writeOverlay("teamColor$teamSide",
                    "#${color.toHexString().replaceAll("FF", "")}");
                colorController.text =
                    "#${color.toHexString().replaceAll("FF", "")}";
              },
              enableAlpha: false,
              colorPickerWidth: 100,
              labelTypes: const [],
            ),
            textEditor(
                width: 80, height: 50, controller: colorController, label: ""),
          ],
        )
      ],
    );
  }

  Widget buildMiddleColumn() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Row(
          children: [
            Text("Update Overlay",
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15)),
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            ElevatedButton(
                onPressed: () {
                  jsonHandler.writeOverlay("scoreLeft", scoreLeft.text);
                  jsonHandler.writeOverlay("scoreRight", scoreRight.text);
                  jsonHandler.writeOverlay("teamNameLeft", teamNameLeft.text);
                  jsonHandler.writeOverlay("teamNameRight", teamNameRight.text);
                  jsonHandler.writeOverlay("teamColorLeft", teamColorLeft.text);
                  jsonHandler.writeOverlay(
                      "teamColorRight", teamColorRight.text);
                  jsonHandler.writeOverlay("week", week.text);
                  jsonHandler.writeOverlay(
                      "playerNamesLeft", playerNamesLeft.text);
                  jsonHandler.writeOverlay(
                      "playerNamesRight", playerNamesRight.text);
                },
                child: const Icon(Icons.system_update_alt)),
          ],
        ),
        const SizedBox(height: 15),
        const Row(
          children: [
            Text("Swap Values",
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15))
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            ElevatedButton(
                onPressed: () {
                  try {
                    // All temp values will be set to the left value at first
                    String tempWins = jsonHandler.readOverlay("winsLeft");
                    String tempScore = scoreLeft.text;
                    String tempPlayerNames = playerNamesLeft.text;
                    String tempTeamName = teamNameLeft.text;
                    String tempTeamColor = teamColorLeft.text;

                    // Set the left side equal to the right
                    jsonHandler.writeOverlay(
                        "winsLeft", jsonHandler.readOverlay("winsRight"));
                    scoreLeft.text = scoreRight.text;
                    playerNamesLeft.text = playerNamesRight.text;
                    teamNameLeft.text = teamNameRight.text;
                    teamColorLeft.text = teamColorRight.text;

                    // Set the right equal to the temp values
                    jsonHandler.writeOverlay("winsRight", tempWins);
                    scoreRight.text = tempScore;
                    playerNamesRight.text = tempPlayerNames;
                    teamNameRight.text = tempTeamName;
                    teamColorRight.text = tempTeamColor;

                    // Write the new data to the json file
                    List<TextEditingController> controllers = [
                      scoreLeft,
                      playerNamesLeft,
                      teamNameLeft,
                      teamColorLeft,
                      scoreRight,
                      playerNamesRight,
                      teamNameRight,
                      teamColorRight
                    ];

                    List<String> keys = [
                      "scoreLeft",
                      "playerNamesLeft",
                      "teamNameLeft",
                      "teamColorLeft",
                      "scoreRight",
                      "playerNamesRight",
                      "teamNameRight",
                      "teamColorRight"
                    ];

                    for (int i = 0; i < controllers.length; i++) {
                      jsonHandler.writeOverlay(keys[i], controllers[i].text);
                    }
                  } catch (e) {
                    if (kDebugMode) {
                      print(e);
                    }
                  }
                },
                child: const Icon(Icons.swap_horiz_sharp))
          ],
        ),
        Row(
          children: [
            textEditor(width: 20, height: 40, controller: week, label: "Week")
          ],
        ),
      ],
    );
  }
}
