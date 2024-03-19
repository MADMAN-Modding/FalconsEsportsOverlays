import 'package:falcons_esports_controller/app.dart' as app;
import 'jsonReader.dart';
import 'gitDownloader.dart';

void main() {
  var jsonReader = JsonReader();

  // Now you can work with jsonData, which will be a Map
  print(jsonReader.fullOutput());
}
