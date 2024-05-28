import 'dart:io';

import 'package:falcons_esports_overlays_controller/handlers/git_handler.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
import 'package:file_picker/file_picker.dart';
import 'package:filesystem_picker/filesystem_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class GitPage extends StatefulWidget {
  const GitPage({super.key});

  @override
  State<StatefulWidget> createState() => _GitPage();
}

class _GitPage extends State<GitPage> {
  var directory = TextEditingController();

  JSONHandler jsonHandler = JSONHandler();

  late String chosenPath;

  @override
  Widget build(BuildContext context) {
    String hint = "Directory Path";

    var git = GitHandler();
    chosenPath = jsonHandler.readConfig('path');

    directory.text = jsonHandler.readConfig("path");

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Make sure the directory is empty if you're cloning the repository.",
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold),
              )
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  height: 50,
                  width: 50,
                  child: TextButton(
                    child: const Icon(
                      Icons.folder,
                      color: Colors.white,
                    ),
                    onPressed: () async {
                      try {
                        if (Platform.isWindows) {
                          chosenPath =
                              (await FilePicker.platform.getDirectoryPath())!;
                        } else {
                          // This is here until the bug on linux is fixed
                          chosenPath = (await FilesystemPicker.open(
                              context: context,
                              theme: FilesystemPickerTheme(
                                  topBar: FilesystemPickerTopBarThemeData(
                                      backgroundColor: Colors.grey),
                                  backgroundColor: Colors.grey),
                              rootDirectory: Directory("/home"),
                              contextActions: [
                                FilesystemPickerNewFolderContextAction()
                              ]))!;

                          directory.text = chosenPath.replaceAll(r"\", r"\\");
                          updateValue(chosenPath);
                        }
                      } catch (e) {
                        return;
                      }
                    },
                  ),
                ),
                SizedBox(
                  width: 400,
                  child: TextField(
                    controller: directory,
                    decoration: InputDecoration(
                      focusedBorder: const UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white, width: 2.0),
                      ),
                      enabledBorder: const UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white, width: 2.0),
                      ),
                      hintText: hint,
                      hintStyle: const TextStyle(color: Colors.white),
                    ),
                    style: const TextStyle(color: Colors.white),
                    onChanged: (value) => updateValue(value),
                  ),
                ),
              ],
            ),
          ),
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: ElevatedButton(
                    onPressed: () async {
                      if (chosenPath != "") {
                        if (kDebugMode) {
                          print(chosenPath);
                        }
                        git.repoCloner(chosenPath, context);
                      } else {
                        try {
                          chosenPath = (await FilePicker.platform
                              .getDirectoryPath()) as String;
                          updateValue(chosenPath);
                        } catch (e) {
                          return;
                        }
                        directory.text = chosenPath;
                      }
                    },
                    child: const Text('Clone Repository'),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: ElevatedButton(
                      onPressed: () async {
                        bool pulled = false;
                        while (!pulled) {
                          try {
                            if (await git.checkRepo(chosenPath)) {
                              git.update(chosenPath, context);
                              pulled = true;
                            } else {
                              try {
                                chosenPath = (await FilePicker.platform
                                    .getDirectoryPath()) as String;
                                updateValue(chosenPath);
                              } catch (e) {
                                return;
                              }
                              directory.text = chosenPath;
                            }
                          } catch (e) {
                            try {
                              chosenPath = (await FilePicker.platform
                                  .getDirectoryPath()) as String;
                            } catch (e) {
                              return;
                            }
                          }
                        }
                      },
                      child: const Text('Update Repository')),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  void updateValue(String value) {
    chosenPath = value;
    jsonHandler.writeConfig("path", value);
    if (kDebugMode) {
      print(chosenPath);
    }
  }
}
