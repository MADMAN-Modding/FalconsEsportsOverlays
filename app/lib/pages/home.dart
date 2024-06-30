import 'package:falcons_esports_overlays_controller/handlers/http_handler.dart';
import 'package:flutter/material.dart';
import '../constants.dart' as constants;

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    constants.Constants.codePath = jsonHandler.readConfig("path");
    constants.Constants.imagePath = jsonHandler.readConfig("imagePath");

    return const Center(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: [
              Padding(
                padding: EdgeInsets.only(left: 8),
                child: Text(
                  'Welcome to the Falcons Esports Overlays Controller!',
                  style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      color: Colors.white),
                ),
              ),
            ],
          ),
          Row(
            children: [
              Padding(
                padding: EdgeInsets.only(left: 8),
                child: Text(
                  'Created by: MADMAN-Modding',
                  style: TextStyle(
                      fontSize: 20,
                      fontStyle: FontStyle.italic,
                      color: Colors.white),
                ),
              ),
            ],
          ),
          Row(
            children: [
              Padding(
                padding: EdgeInsets.only(left: 8, top: 2),
                child: Text(
                  "Instructions",
                  style: TextStyle(color: Colors.white, fontSize: 40),
                ),
              )
            ],
          ),
          Row(
            children: [
              Padding(
                padding: EdgeInsets.only(left: 8, top: 2),
                child: SelectableText(
                  "0. Make sure git is added to the PATH, you can test this with git -v in a command line \n1. Go to config to set your settings\n2. Go to Download & Update to get the overlay\n3. Go to Web Server to start the server\n4. Finally now you can control the overlay from the Overlay Data Page\n5. Make sure to add the overlay as a browser in OBS\nThe URL is http://localhost:8080 and the dimensions are 1920x1080\n6. You can change the falcon image by going to the controls page and pressing the image button",
                  style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 17),
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}
