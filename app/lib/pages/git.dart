import 'package:english_words/english_words.dart';
import 'package:falcons_esports_overlays_controller/git_handler.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class GitPage extends StatefulWidget {
  const GitPage({super.key});

  @override
  State<StatefulWidget> createState() => _GitPage();
}

class _GitPage extends State<GitPage> {
  String? path;

  @override
  Widget build(BuildContext context) {
    var git = GitDownloader();
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
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
                      path = await FilePicker.platform.getDirectoryPath();
                    },
                  ),
                ),
                SizedBox(
                  width: 400,
                  child: TextField(
                    decoration: const InputDecoration(
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.white, width: 2.0),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: Colors.white, width: 2.0),
                      ),
                      hintText: 'Directory Path',
                      hintStyle: TextStyle(color: Colors.white),
                    ),
                    style: const TextStyle(color: Colors.white),
                    onChanged: (value) => path = value,
                  ),
                ),
              ],
            ),
          ),
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                ElevatedButton(
                  onPressed: () {
                    if (path != null) {
                      git.repoCloner(path);
                    }
                  },
                  child: const Text('Clone Repository'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
