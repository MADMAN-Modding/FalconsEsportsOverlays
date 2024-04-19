import 'package:english_words/english_words.dart';
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
        page = HomePage();
        break;
      case 1:
        page = GitPage();
        break;
      case 2:
        page = ControlsPage();
        break;
      case 3:
        page = PHPPage();
        break;
      case 4:
        page = ConfigPage();
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
                extended: constraints.maxWidth >= 900,
                destinations: const [
                  NavigationRailDestination(
                    indicatorColor: Colors.amber,
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
                      icon: Icon(Icons.php),
                      label: Text("PHP Server"),
                      selectedIcon: Icon(
                        Icons.php,
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
                color: Theme.of(context).colorScheme.primary,
                child: page,
              ),
            ),
          ],
        ),
      );
    });
  }
}

