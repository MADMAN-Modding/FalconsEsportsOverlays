import 'dart:io';

import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    // Not many comments needed, just a lot of text
    String ipText = Platform.isAndroid ? "<your_ip>" : "localhost";

    String instructions =
        "1. Go to the Overlay Files page to get the overlays\n2. Go to the Config page to set your settings\n3. Go to the Web Server Page to start the website\n4. To change the overlay information you can control it from the Overlay Data page\n5. Make sure to add the overlay as a browser in OBS\n\t\t\t\t\tThe URL is http://$ipText:8080 and the dimensions are 1920x1080\n6. You can change the falcon logo by going to the Config page and pressing the image button\n7. The enabled sports can be changed on the Config page";
    return SizedBox(
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      child: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Center(
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
                        instructions,
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
          ),
        ),
      ),
    );
  }
}
