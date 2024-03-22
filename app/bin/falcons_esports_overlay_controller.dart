import 'json_reader.dart';
import 'git_downloader.dart';

void main() {
  var jsonReader = JsonReader();
  var gitDownloader = GitDownloader();

  // Now you can work with jsonData, which will be a Map

  gitDownloader.repoCloner();
  gitDownloader.update();
  jsonReader.write();
  print(jsonReader.fullOutput());
}
