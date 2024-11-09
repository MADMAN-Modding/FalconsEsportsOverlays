import 'dart:io';

import 'package:falcons_esports_overlays_controller/common_widgets/color_selector.dart';
import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';
import '../common_widgets/text_editor.dart';
import '../constants.dart' as constants;

class ControlsPage extends StatefulWidget {
  const ControlsPage({super.key});

  @override
  State<StatefulWidget> createState() => _ControlsPageState();
}

class _ControlsPageState extends State<ControlsPage> {
  // Lots of textEditingControllers
  final TextEditingController scoreLeft = TextEditingController();
  final TextEditingController scoreRight = TextEditingController();
  final TextEditingController teamNameLeft = TextEditingController();
  final TextEditingController teamNameRight = TextEditingController();
  final TextEditingController week = TextEditingController();
  final TextEditingController teamColorRight = TextEditingController();
  final TextEditingController teamColorLeft = TextEditingController();
  final TextEditingController playerNamesRight = TextEditingController();
  final TextEditingController playerNamesLeft = TextEditingController();

  var boolMap;

  bool showOverlays = true;

// Default color values
  Color teamColorLeftDefault = const Color.fromRGBO(190, 15, 50, 1);
  Color teamColorRightDefault = Colors.white;

  double multiplier = constants.Constants.multiplier;

  @override
  void initState() {
    super.initState();

    constants.Constants.jsonHandler.jsonHandlerInit();

    boolMap = constants.Constants.jsonHandler.configJSON;

    // Initialize controller values
    scoreLeft.text = constants.Constants.jsonHandler.readOverlay('scoreLeft');
    scoreRight.text = constants.Constants.jsonHandler.readOverlay('scoreRight');
    teamNameLeft.text =
        constants.Constants.jsonHandler.readOverlay('teamNameLeft');
    teamNameRight.text =
        constants.Constants.jsonHandler.readOverlay('teamNameRight');
    week.text = constants.Constants.jsonHandler.readOverlay('week');
    teamColorLeft.text =
        constants.Constants.jsonHandler.readOverlay('teamColorLeft');
    teamColorRight.text =
        constants.Constants.jsonHandler.readOverlay('teamColorRight');
    playerNamesLeft.text =
        constants.Constants.jsonHandler.readOverlay('playerNamesLeft');
    playerNamesRight.text =
        constants.Constants.jsonHandler.readOverlay('playerNamesRight');

    // Tries to get the color values
    try {
      teamColorLeftDefault = HexColor(
          constants.Constants.jsonHandler.readOverlay("teamColorLeft"));
      teamColorRightDefault = HexColor(
          constants.Constants.jsonHandler.readOverlay("teamColorRight"));
    } catch (e) {
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Makes a box that holds everything
    if (!Platform.isAndroid) {
      return appPage();
    }

    return SizedBox(
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      child: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: SingleChildScrollView(
            scrollDirection: Axis.horizontal, child: appPage()),
      ),
    );
  }

  // Function for making the logos to switch which overlay is currently being used
  Widget buildOverlayButton(String overlay, String imagePath) {
    return ElevatedButton(
      onPressed: () => setState(() =>
          constants.Constants.jsonHandler.writeOverlay("overlay", overlay)),
      style: ElevatedButton.styleFrom(
          backgroundColor: constants.Constants.jsonHandler
                      .readOverlay("overlay") ==
                  overlay
              ? ColorScheme.fromSeed(seedColor: constants.Constants.appTheme)
                  .inversePrimary
              : Colors.transparent,
          shadowColor: Colors.transparent),
      child: Image.asset(
        imagePath,
        width: 80 * multiplier,
        height: 80 * multiplier,
      ),
    );
  }

  // Function for making buttons to switch the current score
  Widget scoreButton(
      {required String text, required String jsonKey, required int value}) {
    return Row(
      children: [
        Padding(
            padding: EdgeInsets.only(right: 4 * multiplier),
            child: ElevatedButton(
              onPressed: () {
                constants.Constants.jsonHandler.writeOverlay(jsonKey, "$value");
              },
              style: ButtonStyle(
                minimumSize: WidgetStatePropertyAll(
                  Size(40 * multiplier, 30 * multiplier),
                ),
              ),
              child:
                  DefaultText.text(text, color: constants.Constants.appTheme),
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
    List<Widget> winButtonsTop = [];
    List<Widget> winButtonsBottom = [];
    // For every about of wins your team can have, this will make a button for that
    for (int i = 0; i < 3; i++) {
      winButtonsTop
          .add(scoreButton(text: "$i", jsonKey: "wins$teamSide", value: i));
    }

    for (int i = 3; i < 6; i++) {
      winButtonsBottom
          .add(scoreButton(text: "$i", jsonKey: "wins$teamSide", value: i));
    }

    // All the textEditors to be used
    List<Widget> textEditors = [];

// Foreach controller adds a text editor
    for (int i = 0; i < controllers.length; i++) {
      textEditors.add(
        TextEditor.textEditor(
            width: widths[i],
            height: heights[i],
            controller: controllers[i],
            label: labels[i],
            boxHeight: 5 * multiplier),
      );
    }

    // Returns a column with all the needed info for a team
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              "$teamSide Team",
              style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 20 * multiplier),
            ),
          ],
        ),
        SizedBox(height: 10 * multiplier),
        Text(
          "$teamSide Wins",
          style: const TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: 17),
        ),
        SizedBox(height: 10 * multiplier),
        Row(children: winButtonsTop),
        if (!Platform.isAndroid) ...[
          const SizedBox(
            height: 10,
          )
        ],
        Row(children: winButtonsBottom),
        Column(children: textEditors),
        if (!Platform.isAndroid) const SizedBox(height: 15),
        Column(
          children: [
            // Makes the color selectors
            DefaultText.text("Team Color"),
            ColorSelector.colorPicker(
                color: sideColor,
                colorController: colorController,
                config: false,
                key: "teamColor$teamSide"),
            TextEditor.textEditor(
                width: 80,
                height: 50,
                controller: colorController,
                label: "",
                boxHeight: 0),
          ],
        )
      ],
    );
  }

  Widget buildMiddleColumn() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          children: [
            Text("Hide Overlay Switchers",
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15 * multiplier)),
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            ElevatedButton(
                child: Icon(
                  Icons.hide_image_outlined,
                  color: constants.Constants.appTheme,
                ),
                onPressed: () {
                  setState(() {
                    showOverlays = !showOverlays;
                  });
                }),
          ],
        ),
        if (!Platform.isAndroid) const SizedBox(height: 15),
        Row(
          children: [
            Text("Update Overlay",
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15 * multiplier)),
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            // Update all the values
            ElevatedButton(
              onPressed: () {
                constants.Constants.jsonHandler
                    .writeOverlay("scoreLeft", scoreLeft.text);
                constants.Constants.jsonHandler
                    .writeOverlay("scoreRight", scoreRight.text);
                constants.Constants.jsonHandler
                    .writeOverlay("teamNameLeft", teamNameLeft.text);
                constants.Constants.jsonHandler
                    .writeOverlay("teamNameRight", teamNameRight.text);
                constants.Constants.jsonHandler
                    .writeOverlay("teamColorLeft", teamColorLeft.text);
                constants.Constants.jsonHandler
                    .writeOverlay("teamColorRight", teamColorRight.text);
                constants.Constants.jsonHandler.writeOverlay("week", week.text);
                constants.Constants.jsonHandler
                    .writeOverlay("playerNamesLeft", playerNamesLeft.text);
                constants.Constants.jsonHandler
                    .writeOverlay("playerNamesRight", playerNamesRight.text);
              },
              style: ButtonStyle(
                minimumSize: WidgetStatePropertyAll(
                  Size(60 * multiplier, 40 * multiplier),
                ),
              ),
              child: Icon(
                Icons.system_update_alt,
                color: constants.Constants.appTheme,
              ),
            ),
          ],
        ),
        if (!Platform.isAndroid) const SizedBox(height: 15),
        Row(
          children: [
            Text("Swap Values",
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 15 * multiplier))
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            ElevatedButton(
                onPressed: () {
                  try {
                    // All temp values will be set to the left value at first
                    String tempWins =
                        constants.Constants.jsonHandler.readOverlay("winsLeft");
                    String tempScore = scoreLeft.text;
                    String tempPlayerNames = playerNamesLeft.text;
                    String tempTeamName = teamNameLeft.text;
                    String tempTeamColor = teamColorLeft.text;

                    // Set the left side equal to the right
                    constants.Constants.jsonHandler.writeOverlay(
                        "winsLeft",
                        constants.Constants.jsonHandler
                            .readOverlay("winsRight"));
                    scoreLeft.text = scoreRight.text;
                    playerNamesLeft.text = playerNamesRight.text;
                    teamNameLeft.text = teamNameRight.text;
                    teamColorLeft.text = teamColorRight.text;

                    // Set the right equal to the temp values
                    constants.Constants.jsonHandler
                        .writeOverlay("winsRight", tempWins);
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
                      constants.Constants.jsonHandler
                          .writeOverlay(keys[i], controllers[i].text);
                    }
                  } catch (e) {
                    if (kDebugMode) {
                      print(e);
                    }
                  }
                },
                style: ButtonStyle(
                  minimumSize: WidgetStatePropertyAll(
                    Size(80 * multiplier, 40 * multiplier),
                  ),
                  maximumSize: WidgetStatePropertyAll(
                    Size(120 * multiplier, 60 * multiplier),
                  ),
                ),
                child: Icon(
                  Icons.swap_horiz_sharp,
                  color: constants.Constants.appTheme,
                ))
          ],
        ),
        Row(
          children: [
            TextEditor.textEditor(
                width: 20,
                height: 40,
                controller: week,
                label: "Week",
                boxHeight: 5)
          ],
        ),
      ],
    );
  }

  Widget appPage() {
    return Center(
      child: Column(
        children: [
          // Overlay Switchers
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.max,
            children: [
              if (showOverlays) ...[
                if (constants.Constants.jsonHandler.readConfig("ssbuChecked"))
                  buildOverlayButton('ssbu', 'images/SSBU.png'),
                if (constants.Constants.jsonHandler.readConfig("kartChecked"))
                  buildOverlayButton('kart', 'images/Kart.png'),
                if (constants.Constants.jsonHandler.readConfig("owChecked"))
                  buildOverlayButton('overwatch', 'images/Overwatch.png'),
                if (constants.Constants.jsonHandler.readConfig("rlChecked"))
                  buildOverlayButton('rocketLeague', 'images/RL.png'),
                if (constants.Constants.jsonHandler.readConfig("splatChecked"))
                  buildOverlayButton('splat', 'images/SPLAT.png'),
              ],
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.max,
            children: [
              if (showOverlays) ...[
                if (constants.Constants.jsonHandler.readConfig("valChecked"))
                  buildOverlayButton('val', 'images/VAL.png'),
                if (constants.Constants.jsonHandler.readConfig("hearthChecked"))
                  buildOverlayButton('hearth', 'images/Hearth.png'),
                if (constants.Constants.jsonHandler.readConfig("lolChecked"))
                  buildOverlayButton('lol', 'images/LOL.png'),
                if (constants.Constants.jsonHandler.readConfig("chessChecked"))
                  buildOverlayButton('chess', 'images/Chess.png'),
                if (constants.Constants.jsonHandler.readConfig("maddenChecked"))
                  buildOverlayButton('madden', 'images/Madden.png'),
                if (constants.Constants.jsonHandler.readConfig("nba2KChecked"))
                  buildOverlayButton('nba2K', 'images/NBA2K.png')
              ],
            ],
          ),
          // Spacer
          if (!Platform.isAndroid) const SizedBox(height: 20),
          // Row that holds everything
          Row(
            // Makes all the columns
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
}
