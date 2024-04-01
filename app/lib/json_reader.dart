import 'dart:convert';
import 'dart:io';

class JsonReader {
  var jsonData = {};
  var file;

  JsonReader() {
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

  void write() {
    var fileWrite = file.openWrite();

    fileWrite.write('{"test":"test"}');
  }

  String read(String key) {
    return jsonData[key];
  }
}
