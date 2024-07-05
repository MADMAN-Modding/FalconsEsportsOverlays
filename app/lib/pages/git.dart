import 'package:falcons_esports_overlays_controller/common_widgets/default_text.dart';
import 'package:falcons_esports_overlays_controller/constants.dart';
import 'package:falcons_esports_overlays_controller/handlers/git_handler.dart';
import 'package:falcons_esports_overlays_controller/handlers/json_handler.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../commands/folder_picker.dart';
import '../common_widgets/text_editor.dart';

class GitPage extends StatefulWidget {
  const GitPage({super.key});

  @override
  State<StatefulWidget> createState() => _GitPage();
}

class _GitPage extends State<GitPage> {
  TextEditingController directory = TextEditingController();

  late String chosenPath;

  @override
  Widget build(BuildContext context) {
    // Sets the chosen values
    chosenPath = Constants.codePath;

    // Sets the value of the text controller
    directory.text = chosenPath;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Nice little warning for the user
              DefaultText.text(
                  "Make sure the directory is empty if you're cloning the repository."),
            ],
          ),
          Padding(
            // Adds some padding
            padding: const EdgeInsets.all(6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // This box holds the folder icon
                SizedBox(
                  height: 50,
                  width: 50,
                  child: TextButton(
                    child: const Icon(
                      Icons.folder,
                      color: Colors.white,
                    ),
                    onPressed: () async {
                      String newChosenPath =
                          (await FolderPicker.folderPicker(context));
                      // If the new path is equal to "" then it won't update the value of the current path
                      chosenPath =
                          newChosenPath == "" ? chosenPath : newChosenPath;
                      directory.text = chosenPath.replaceAll(r"\", r"\\");
                      updateValue(chosenPath);
                    },
                  ),
                ),
                // Text editor for manually adding the path
                TextEditor.textEditor(
                    width: 700,
                    height: 40,
                    controller: directory,
                    label: "",
                    boxHeight: 0,
                    onChange: true),
              ],
            ),
          ),
          // Buttons for cloning and updating the repository
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: ElevatedButton(
                    onPressed: () async {
                      // If the chosen path is set, then clone the repo
                      if (chosenPath != "") {
                        if (kDebugMode) {
                          print(chosenPath);
                        }
                        GitHandler().repoCloner(chosenPath, context);
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
                        // This check might be considered annoying but if you want to pull my code, you better do it in a repository :)
                        while (!pulled) {
                          try {
                            // If it's a repo, pull the code
                            if (await GitHandler().checkRepo(chosenPath)) {
                              GitHandler().update(chosenPath, context);
                              pulled = true;
                            } else {
                              // If it isn't try to get a new path that is a repo
                              try {
                                chosenPath =
                                    (await FolderPicker.folderPicker(context));
                                updateValue(chosenPath);
                              } catch (e) {
                                // If it fails, run the loop again
                                return;
                              }
                              // When it finally works update the path
                              directory.text = chosenPath;
                            }
                            // If it fails update the path again
                          } catch (e) {
                            try {
                              chosenPath =
                                  (await FolderPicker.folderPicker(context));
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

  // Updates the value of the config
  void updateValue(String value) {
    chosenPath = value;
    JSONHandler().writeConfig("path", value);
    if (kDebugMode) {
      print(chosenPath);
    }
  }
}
