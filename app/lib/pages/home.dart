import 'dart:io';

import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    // Not many comments needed, just a lot of text
    const String pcInstructions =
        "0. Make sure git is added to the PATH, you can test this with git -v in a command line \n1. Go to Config to set your settings\n2. Go to Overlay Files to get the overlays\n3. Go to Web Server to start the server\n4. Finally now you can control the overlay from Overlay Data\n5. Make sure to add the overlay as a browser in OBS\n\t\t\t\t\tThe URL is http://localhost:8080 and the dimensions are 1920x1080\n6. You can change the falcon image by going to the controls page and pressing the image button\n7. You can change the enabled sports in the config page";

    String androidInstructions =
        "1. Go to Overlay Files to get the overlays\n2. Go to Config to set your settings\n3. Go to Web Server to start the server\n4. Finally now you can control the overlay from Overlay Data\n5. Make sure to add the overlay as a browser in OBS and the dimensions are 1920x1080\n\t\t\t\t\tThe URL is http://<your_ip>:8080 Your IP can be found in your network settings\n6. You can change the falcon image by going to the controls page and pressing the image button\n7. You can change the enabled sports in the config page";
    return Center(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Row(
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
          const Row(
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
          const Row(
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
                padding: const EdgeInsets.only(left: 8, top: 2),
                child: SelectableText(
                  (Platform.isAndroid ? androidInstructions : pcInstructions),
                  style: const TextStyle(
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
