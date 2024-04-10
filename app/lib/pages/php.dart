import 'package:falcons_esports_overlays_controller/php_server_handler.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_popup_card/flutter_popup_card.dart';

class PHPPage extends StatefulWidget {
  const PHPPage({super.key});

  @override
  State<StatefulWidget> createState() => _PHPPage();
}

class _PHPPage extends State<PHPPage> {
  String chosenPath = "";
  PHPServerHandler php = PHPServerHandler();

  var directory = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            ElevatedButton(
                onPressed: () {
                  php.startServer();
                },
                child: const Text("Start PHP Server")),
            ElevatedButton(
                onPressed: () {
                  php.stopServer();
                },
                child: Text("Stop PHP Server"))
          ],
        )
      ],
    );
  }
}
