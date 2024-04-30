import 'package:falcons_esports_overlays_controller/handlers/git_handler.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_popup_card/flutter_popup_card.dart';

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
    this.chosenPath = jsonHandler.readConfig('path');

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
                style: TextStyle(color: Colors.white),
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
                        chosenPath =
                            (await FilePicker.platform.getDirectoryPath())!;
                        directory.text = chosenPath.replaceAll(r"\", r"\\");
                        updateValue(chosenPath);
                      } catch (e) {}
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
                        git.repoCloner(chosenPath);
                        showPopupCard(
                          context: context,
                          builder: (context) {
                            return PopupCard(
                              elevation: 8,
                              color: const Color.fromARGB(255, 255, 255, 255),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text('Repository cloned to $chosenPath'),
                              ),
                            );
                          },
                          offset: const Offset(-16, 70),
                          alignment: Alignment.topRight,
                          useSafeArea: true,
                        );
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
                              git.update(chosenPath);
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
