import 'dart:io';

import 'package:falcons_esports_overlays_controller/common_widgets/color_selector.dart';
import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:falcons_esports_overlays_controller/constants.dart';
import 'package:flutter/material.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
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
  String codePath = Constants.codePath;
  String imagePath = Constants.imagePath;

// Creates objects for the jsonHandler and for changing the text
  TextEditingController directory = TextEditingController();
  TextEditingController appTheme = TextEditingController();
  TextEditingController gitDirectory = TextEditingController();

// ImagePicker library object
  ImagePicker picker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    directory.text = Constants.codePath;
    codePath = directory.text;
    appTheme.text =
        "#${Constants.appTheme.toHexString().replaceFirst("FF", "")}";
    FileImage logo = FileImage(File(""));

    if (File(
            "$codePath${Constants.slashType}images${Constants.slashType}Esports-Logo.png")
        .existsSync()) {
      logo = FileImage(File(
          "$codePath${Constants.slashType}images${Constants.slashType}Esports-Logo.png"));
    }

    return SizedBox(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          // Code Directory

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
                                (await FolderPicker.folderPicker(context));

                            // If the returned path is blank then it won't take the value
                            if (newImagePath != "") {
                              imagePath = newImagePath;
                              try {
                                // Writes the old logo with the supplied path, this has both items as FileImages
                                logo.file.writeAsBytesSync(
                                    FileImage(File(imagePath))
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
                          width: 400,
                        )
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: [
                        DefaultText.text(
                            "App Theme (Restart required for color changes to apply)")
                      ],
                    ),
                  ),
                  // Makes a color picker that is used for the apps theme
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: [
                        ColorSelector.colorPicker(
                            color: Constants.appTheme,
                            colorController: appTheme),
                        TextEditor.textEditor(
                            width: 200,
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
                          Row(
                            children: [
                              Checkbox(
                                  value: Constants.ssbuChecked,
                                  onChanged: (bool? value) {
                                    setState(() {
                                      Constants.ssbuChecked = value!;
                                      JSONHandler().writeConfig("ssbuChecked",
                                          value ? "true" : "false");
                                    });
                                  })
                            ],
                          )
                        ],
                      )
                    ],
                  )
                ],
              )
            ],
          ),
        ],
      ),
    );
  }

  void stringValueSetter(String value) {
    codePath = value;
  }
}
