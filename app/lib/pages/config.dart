import 'dart:io';

import 'package:falcons_esports_overlays_controller/common_widgets/color_selector.dart';
import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:falcons_esports_overlays_controller/constants.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
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
  JSONHandler jsonHandler = JSONHandler();

// ImagePicker library object
  ImagePicker picker = ImagePicker();

  @override
  Widget build(BuildContext context) {
    directory.text = Constants.codePath;
    codePath = directory.text;
    appTheme.text = Constants.appTheme.toString();
    FileImage logo = FileImage(File(""));

    if (File(
            "$codePath${Constants.slashType}images${Constants.slashType}Esports-Logo.png")
        .existsSync()) {
      logo = FileImage(File(
          "$codePath${Constants.slashType}images${Constants.slashType}Esports-Logo.png"));
    }
    if (kDebugMode) {
      print(logo.file.path);
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        // Padding for all the elements
        // Code Directory
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
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

                    directory.text =
                        codePath.toString(); // Sets the text equal to the path
                    jsonHandler.writeConfig('path', codePath.toString());
                  },
                ),
              ),

              // Sets the size of the textfield and also does some stuff with the controller
              TextEditor.textEditor(
                  width: 400,
                  height: 40,
                  controller: directory,
                  label: "",
                  boxHeight: 0,
                  onChange: true),
              const Padding(
                padding: EdgeInsets.all(8.0),
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
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
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
                            FileImage(File(imagePath)).file.readAsBytesSync());
                      } catch (e) {
                        if (kDebugMode) {
                          print(e);
                        }
                      }
                    }

                    directory.text =
                        codePath.toString(); // Sets the text equal to the path

                    logo.evict();
                  },
                ),
              ),
              DefaultText.text(
                  "Set the image you would like to use for the overlay icon. "),
            ],
          ),
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
            children: [DefaultText.text("App Theme")],
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              ColorSelector.colorPicker(
                  color: Constants.appTheme, colorController: appTheme),
              TextEditor.textEditor(
                  width: 200,
                  height: 40,
                  controller: appTheme,
                  label: "",
                  boxHeight: 40)
            ],
          ),
        )
      ],
    );
  }

  void stringValueSetter(String value) {
    codePath = value;
  }
}
