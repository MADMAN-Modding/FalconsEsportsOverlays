import 'dart:convert';
import 'dart:io';

class JsonReader {
  var jsonData = {};
  var file;

  JsonReader() {
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

    fileWrite.write('{test}');
  }
}
