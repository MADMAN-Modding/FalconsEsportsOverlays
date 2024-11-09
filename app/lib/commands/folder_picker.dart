import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:filesystem_picker/filesystem_picker.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

// This is meant for only picking folders
class FolderPicker {
  static Future<String> folderPicker(BuildContext context) async {
    // If the user doesn't respond then it returns ""
    try {
      // If its windows it a nice and easy file pickers
      if (!Platform.isWindows) {
        var text = (await (FilePicker.platform.getDirectoryPath()))!;
        return text;
        // If its Unix, its not as easy :(
      } else {
        // This is here until the bug on linux is fixed
        return (await FilesystemPicker.open(
            // Page content
            context: context,
            theme: FilesystemPickerTheme(
                topBar: FilesystemPickerTopBarThemeData(
                    backgroundColor: Colors.grey),
                backgroundColor: const Color.fromARGB(255, 110, 107, 107)),
            rootDirectory: Directory(Platform.isAndroid
                ? getApplicationDocumentsDirectory().toString()
                : "/home"),
            contextActions: [FilesystemPickerNewFolderContextAction()]))!;
      }
    }
    // If the user gives us nothing
    catch (e) {
      return "";
    }
  }
}
