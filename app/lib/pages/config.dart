import 'dart:io';

import 'package:falcons_esports_overlays_controller/commands/file_pick.dart';
import 'package:falcons_esports_overlays_controller/common_widgets/color_selector.dart';
import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:falcons_esports_overlays_controller/constants.dart'
    as constants;
import 'package:flutter/material.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:image_picker/image_picker.dart';
import '../commands/folder_picker.dart';
import '../common_widgets/text_editor.dart';

// Sets up the stateful widget stuff, wahoo
class ConfigPage extends StatefulWidget {
  const ConfigPage({super.key});

  @override
  State<StatefulWidget> createState() => _ControlsPage();
}

// Class for the actual page
class _ControlsPage extends State<ConfigPage> {
  String codePath = constants.Constants.codePath;
  String imagePath = constants.Constants.imagePath;

// Creates objects for the jsonHandler and for changing the text
  TextEditingController gitDirectory = TextEditingController();

// ImagePicker library object
  ImagePicker picker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    TextEditingController directory = TextEditingController();
    TextEditingController appTheme = TextEditingController();

    directory.text = constants.Constants.jsonHandler.configJSON["path"];
    codePath = directory.text;
    appTheme.text =
        "${constants.Constants.jsonHandler.configJSON["appTheme"].replaceFirst("FF", "")}";

    FileImage logo;

    try {
      logo = FileImage(File(
          "$codePath${constants.Constants.jsonHandler.androidFolder}${constants.Constants.slashType}images${constants.Constants.slashType}Esports-Logo.png"));
    } catch (e) {
      logo = FileImage(File("path"));
    }
    if (!Platform.isAndroid) {
      return appPage(directory, logo, appTheme);
    }

    return SizedBox(
      height: MediaQuery.of(context).size.height,
      child: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: appPage(directory, logo, appTheme)),
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

  Widget appPage(TextEditingController directory, FileImage logo,
      TextEditingController appTheme) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        // Code Directory
        if (!Platform.isAndroid) ...[
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: EdgeInsets.only(left: 13),
                child: Text(
                  "This is the directory that contains all the code",
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 17),
                ),
              ),
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.max,
            children: [
              // Makes a box for the input
              SizedBox(
                height: 50,
                width: 50,
                // A button with the folder icon that opens up a file-picker in order to chose the appropriate directory
                child: TextButton(
                  child: const Icon(
                    Icons.folder,
                    color: Colors.white,
                  ),
                  onPressed: () async {
                    String newCodePath =
                        (await FolderPicker.folderPicker(context));

                    // If the returned path is blank then it won't take the value
                    codePath = newCodePath == "" ? codePath : newCodePath;

                    // Sets the value of the directory text editing controller
                    directory.text =
                        codePath.toString(); // Sets the text equal to the path
                    JSONHandler().writeConfig('path', codePath.toString());
                  },
                ),
              ),

              // Sets the size of the textfield and also does some stuff with the controller
              TextEditor.textEditor(
                  width: 550,
                  height: 40,
                  controller: directory,
                  label: "",
                  boxHeight: 0,
                  onChange: true),
            ],
          ),
        ],
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
                          if (newImagePath != "") {
                            imagePath = newImagePath;
                            try {
                              // Writes the old logo with the supplied path, this has both items as FileImages
                              logo.file.writeAsBytesSync(FileImage(
                                      File(imagePath.replaceAll(r"\", r"\\")))
                                  .file
                                  .readAsBytesSync());
                            } catch (e) {}
                          }
                          // Sets the text equal to the path
                          directory.text = codePath.toString();

                          // Clears the cache
                          logo.evict();
                        },
                      ),
                    ),
                    DefaultText.text(
                        "Set the image you would like to use for the overlay icon. "),
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
            )
          ],
        ),
      ],
    );
  }
}
