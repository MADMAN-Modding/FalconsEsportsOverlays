import 'dart:io';

import 'package:english_words/english_words.dart';
import 'package:falcons_esports_overlays_controller/handlers/http_handler.dart';
import 'package:falcons_esports_overlays_controller/pages/http.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Pages
import 'pages/controls.dart';
import 'pages/git.dart';
import 'pages/home.dart';
import 'pages/php.dart';
import 'pages/config.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        title: 'Falcons Esports Overlay Controller',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
              seedColor: const Color.fromRGBO(190, 15, 52, 1)),
          textSelectionTheme: const TextSelectionThemeData(
              cursorColor: Colors.white,
              selectionColor: Color.fromARGB(125, 255, 255, 255)),
        ),
        home: const MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  var current = WordPair.random();

  void getNext() {
    current = WordPair.random();
    notifyListeners();
  }

  var favorites = <WordPair>[];

  void toggleFavorite() {
    if (favorites.contains(current)) {
      favorites.remove(current);
    } else {
      favorites.add(current);
    }
    notifyListeners();
  }
}

var favorites = <WordPair>[];

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var selectedIndex = 0;

  // Page selection switch statement
  @override
  Widget build(BuildContext context) {
    Widget page;
    switch (selectedIndex) {
      case 0:
        page = const HomePage();
        break;
      case 1:
        page = const GitPage();
        break;
      case 2:
        page = const ControlsPage();
        break;
      case 3:
        page = const HTTPPage();
        break;
      case 4:
        page = const ConfigPage();
        break;
      default:
        throw UnimplementedError('no widget for $selectedIndex');
    }

    return LayoutBuilder(builder: (context, constraints) {
      return Scaffold(
        body: Row(
          children: [
            SafeArea(
              child: NavigationRail(
                backgroundColor: Colors.white,
                indicatorColor: Theme.of(context).colorScheme.primary,
                extended: constraints.maxWidth >= 1005,
                destinations: const [
                  NavigationRailDestination(
                    icon: Icon(
                      Icons.home,
                    ),
                    selectedIcon: Icon(
                      Icons.home,
                      color: Colors.white,
                    ),
                    label: Text('Home'),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.download),
                    label: Text('Download & Update Overlay'),
                    selectedIcon: Icon(
                      Icons.download,
                      color: Colors.white,
                    ),
                  ),
                  NavigationRailDestination(
                      icon: Icon(Icons.edit),
                      label: Text('Overlay Data'),
                      selectedIcon: Icon(
                        Icons.edit,
                        color: Colors.white,
                      )),
                  NavigationRailDestination(
                      icon: Icon(Icons.http),
                      label: Text("Web Server"),
                      selectedIcon: Icon(
                        Icons.cell_tower,
                        color: Colors.white,
                      )),
                  NavigationRailDestination(
                      icon: Icon(Icons.settings),
                      label: Text("Config"),
                      selectedIcon: Icon(
                        Icons.settings,
                        color: Colors.white,
                      ))
                ],
                selectedIndex: selectedIndex,
                onDestinationSelected: (value) {
                  setState(() {
                    selectedIndex = value;
                  });
                },
              ),
            ),
            Expanded(
              child: Container(
                color: const Color.fromARGB(255, 193, 15, 52),
                child: page,
              ),
            ),
          ],
        ),
      );
    });
  }
}

class HTTPServerObjectStorage {
  HTTPHandler http = HTTPHandler();

  void setServer(HTTPHandler http) {
    this.http = http;
  }

  HTTPHandler getServer() {
    return http;
  }
}
