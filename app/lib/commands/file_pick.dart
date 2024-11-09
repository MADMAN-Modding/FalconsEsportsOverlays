import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:filesystem_picker/filesystem_picker.dart';
import 'package:flutter/material.dart';

class FilePick {
  // Async function
  static Future<String> filePicker(BuildContext context) async {
    String directory = Platform.isAndroid ? "/storage/emulated/0" : "/home";

    // Tries to get a response from the user for the path they want
    // If they don't respond it will return ""
    try {
      // Since there's a bug on Linux that makes the file picker not work on linux this runs a separate one for Linux
      if (!Platform.isAndroid) {
        FilePickerResult? result = await FilePicker.platform
            .pickFiles(type: FileType.image, allowMultiple: false);
        return result!.paths.toString().replaceAll("[", "").replaceAll("]", "");
      } else {
        // This is here until the bug on linux is fixed
        return (await FilesystemPicker.open(
            // Config stuff
            context: context,
            theme: FilesystemPickerTheme(
                topBar: FilesystemPickerTopBarThemeData(
                    backgroundColor: Colors.grey),
                backgroundColor: const Color.fromARGB(255, 110, 107, 107)),
            rootDirectory: Directory(directory),
            contextActions: [FilesystemPickerNewFolderContextAction()]))!;
      }
      // If the user doesn't pick a directory, return ""
    } catch (e) {
      return "";
    }
  }
}
