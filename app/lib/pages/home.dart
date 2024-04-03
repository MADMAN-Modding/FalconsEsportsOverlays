import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            'Welcome to the Falcons Esports Overlay Controller!',
            style: TextStyle(
                fontSize: 30, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          Text(
            'Written in Dart with the Flutter library',
            style: TextStyle(
                fontSize: 20, fontStyle: FontStyle.italic, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
