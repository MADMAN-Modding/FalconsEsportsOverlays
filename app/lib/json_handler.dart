import 'dart:convert';
import 'dart:io';

class JSONHandler {
  var jsonData = {};
  var file;

  JSONHandler() {
    // Gets the json file
    file = File('json/overlay.json');

    // Read the JSON file as a string
    var jsonString = file.readAsStringSync();

    // Parse the JSON string into a Map
    jsonData = json.decode(jsonString);
  }

  Map fullOutput() {
    return jsonData;
  }

  void write(String key, String data) {
    var fileWrite = file.openWrite();

    fileWrite.write('{"$key":"$data"}');
  }

  String read(String key) {
    return jsonData[key];
  }

  // String getKeys() {
  //   for (var key in file.openRead()) {
  //     return key;
  //   }

  // }
}
