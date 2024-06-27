import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:filesystem_picker/filesystem_picker.dart';
import 'package:flutter/material.dart';

class FolderPicker {
  static Future<String> folderPicker(BuildContext context) async {
    try {
      if (Platform.isWindows) {
        var text = (await (FilePicker.platform.getDirectoryPath()))!;
        return text;
      } else {
        print("test");
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
