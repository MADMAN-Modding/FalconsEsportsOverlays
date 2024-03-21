import 'JsonReader.dart';
import 'GitDownloader.dart';

void main() {
  var jsonReader = JsonReader();
  var gitDownloader = GitDownloader();

  // Now you can work with jsonData, which will be a Map
  print(jsonReader.fullOutput());

  gitDownloader.repoCloner();
  gitDownloader.update();
}