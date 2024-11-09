import 'dart:io';

import 'package:falcons_esports_overlays_controller/commands/file_pick.dart';
import 'package:falcons_esports_overlays_controller/common_widgets/color_selector.dart';
import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;
import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:image_picker/image_picker.dart';
import '../common_widgets/text_editor.dart';

// Sets up the stateful widget stuff, wahoo
class ConfigPage extends StatefulWidget {
  const ConfigPage({super.key});

  @override
  State<StatefulWidget> createState() => _ControlsPage();
}

// Class for the actual page
class _ControlsPage extends State<ConfigPage> {
  String codePath = constants.Constants.overlayDirectory;
  String imagePath = constants.Constants.imagePath;

// ImagePicker library object
  ImagePicker picker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    TextEditingController appTheme = TextEditingController();

    appTheme.text = constants.Constants.jsonHandler.configJSON["appTheme"]
        .replaceFirst("FF", "")
        .toString()
        .toUpperCase();

    FileImage logo;

    try {
      logo = FileImage(File(
          "${constants.Constants.executableDirectory}${constants.Constants.slashType}Esports-Logo.png"));
    } catch (e) {
      logo = FileImage(File("path"));
    }
    if (!Platform.isAndroid) {
      return appPage(logo, appTheme);
    }

    return SizedBox(
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      child: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: SingleChildScrollView(
            scrollDirection: Axis.horizontal, child: appPage(logo, appTheme)),
      ),
    );
  }

  void stringValueSetter(String value) {
    codePath = value;
  }

  Widget checkBoxMaker(String text, String key) {
    return Row(
      children: [
        DefaultText.text(text),
        Checkbox(
          activeColor: const Color.fromARGB(125, 255, 255, 255),
          value: constants.Constants.jsonHandler.readConfig(key),
          onChanged: (bool? checked) {
            setState(() {
              checked = checked!;
              constants.Constants.jsonHandler.writeConfig(key, checked);
            });
          },
        )
      ],
    );
  }

  Widget appPage(FileImage logo, TextEditingController appTheme) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        // Makes the image button and the text
        Row(
          children: [
            Column(
              children: [
                Row(
                  children: [
                    SizedBox(
                      height: 50,
                      width: 50,
                      child: TextButton(
                        child: const Icon(
                          Icons.image,
                          color: Colors.white,
                        ),
                        onPressed: () async {
                          String newImagePath =
                              (await FilePick.filePicker(context));

                          // If the returned path is blank then it won't take the value
                          if (newImagePath.isNotEmpty) {
                            setState(() {
                              imagePath = newImagePath;
                              try {
                                print(imagePath);
                                // Writes the old logo with the supplied path, this has both items as FileImages
                                logo.file.writeAsBytesSync(FileImage(
                                        File(imagePath.replaceAll(r"\", r"\\")))
                                    .file
                                    .readAsBytesSync());

                                logo = FileImage(
                                    File(imagePath.replaceAll(r"\", r"\\")));

                                File("${constants.Constants.overlayDirectory}${constants.Constants.slashType}images${constants.Constants.slashType}Esports-Logo.png")
                                    .writeAsBytesSync(
                                        logo.file.readAsBytesSync());

                                // Clears the image cache
                                imageCache.evict(logo);
                                imageCache.clear();
                                imageCache.clearLiveImages();
                              } catch (e) {}
                            });
                          }
                        },
                      ),
                    ),
                    DefaultText.text(
                        "Set the image you would like to use for the overlay icon. ${Platform.isWindows ? "\nThere's a bug with flutter on Windows,\nyou need to change pages, to see the logo change on this page" : ""}"),
                  ],
                ),
                // Displays the logo
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      Image.file(
                        logo.file,
                        width: 400 * (Platform.isAndroid ? 0.4 : 1),
                        key: UniqueKey(),
                      )
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      DefaultText.text(
                          "App Theme (Change page for color changes to apply)")
                    ],
                  ),
                ),
                // Makes a color picker that is used for the apps theme
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      ColorSelector.colorPicker(
                          color: HexColor(constants
                              .Constants.jsonHandler.configJSON["appTheme"]),
                          colorController: appTheme),
                      TextEditor.textEditor(
                          width: 200 * constants.Constants.multiplier,
                          height: 40,
                          controller: appTheme,
                          label: "",
                          boxHeight: 40,
                          onChange: true,
                          key: "appTheme")
                    ],
                  ),
                ),
              ],
            ),
            Column(
              children: [
                Row(
                  children: [
                    Column(
                      children: [
                        DefaultText.text("Choose your school sports!"),
                        checkBoxMaker(
                            "Super Smash Bros. Ultimate", "ssbuChecked"),
                        checkBoxMaker("Mario Kart", "kartChecked"),
                        checkBoxMaker("Overwatch", "owChecked"),
                        checkBoxMaker("Rocket League", "rlChecked"),
                        checkBoxMaker("Splatoon", "splatChecked"),
                        checkBoxMaker("Valorant", "valChecked"),
                        checkBoxMaker("Hearth Stone", "hearthChecked"),
                        checkBoxMaker("League of Legends", "lolChecked"),
                        checkBoxMaker("Chess", "chessChecked"),
                        checkBoxMaker("Madden", "maddenChecked"),
                        checkBoxMaker("NBA 2K", "nba2KChecked")
                      ],
                    )
                  ],
                )
              ],
            ),
          ],
        ),
      ],
    );
  }
}
