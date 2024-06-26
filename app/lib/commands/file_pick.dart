import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:filesystem_picker/filesystem_picker.dart';
import 'package:flutter/material.dart';

class FilePick {
  static Future<String> folderPicker(BuildContext context) async {
    try {
      if (Platform.isWindows) {
        FilePickerResult? result = await FilePicker.platform.pickFiles();
        return result.toString();
      } else {
        // This is here until the bug on linux is fixed
        return (await FilesystemPicker.open(
            context: context,
            theme: FilesystemPickerTheme(
                topBar: FilesystemPickerTopBarThemeData(
                    backgroundColor: Colors.grey),
                backgroundColor: const Color.fromARGB(255, 110, 107, 107)),
            rootDirectory: Directory("/home"),
            contextActions: [FilesystemPickerNewFolderContextAction()]))!;
      }
      // ignore: empty_catches
    } catch (e) {
      return "";
    }
  }
}
