import 'package:flutter/material.dart';
import '../handlers/json_handler.dart';

class NewControlsPage extends StatefulWidget {
  const NewControlsPage({super.key});

  @override
  State<StatefulWidget> createState() => _NewControlsPage();
}

class _NewControlsPage extends State<NewControlsPage> {
  TextEditingController leftScore = TextEditingController();
  TextEditingController rightScore = TextEditingController();
  TextEditingController teamNameLeft = TextEditingController();
  TextEditingController teamNameRight = TextEditingController();
  TextEditingController week = TextEditingController();
  TextEditingController teamColorRight = TextEditingController();
  TextEditingController teamColorLeft = TextEditingController();
  TextEditingController playerNamesRight = TextEditingController();
  TextEditingController playerNamesLeft = TextEditingController();
  JSONHandler jsonHandler = JSONHandler();

  Color rightTeamColor = Colors.white;
  Color leftTeamColor = const Color.fromRGBO(190, 15, 50, 1);

  @override
  Widget build(BuildContext context) {
    week.text = jsonHandler.readOverlay('week');
    return SizedBox(
      height: MediaQuery.of(context).size.height,
      child: Column(
        children: [
          // Overlay Switchers
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                ),
                onPressed: () {
                  jsonHandler.writeOverlay("overlay", "ssbu");
                },
                child: Image.asset(
                  'images/SSBU.png',
                  width: 100,
                  height: 100,
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                ),
                onPressed: () {
                  jsonHandler.writeOverlay("overlay", "kart");
                },
                child: Image.asset(
                  'images/Kart.png',
                  width: 100,
                  height: 100,
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                ),
                onPressed: () {
                  jsonHandler.writeOverlay("overlay", "rocketLeague");
                },
                child: Image.asset(
                  'images/RL.png',
                  width: 100,
                  height: 100,
                ),
              )
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Text(
                        'Left Team',
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 20),
                      ),
                    ],
                  ),
                  const Row(
                    children: [
                      Text(
                        "Wins",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 17),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(right: 4),
                        child: ElevatedButton(
                            onPressed: () {
                              jsonHandler.writeOverlay('winsLeft', '0');
                            },
                            child: const Text("0")),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(right: 4),
                        child: ElevatedButton(
                            onPressed: () {
                              jsonHandler.writeOverlay('winsLeft', '1');
                            },
                            child: const Text('1')),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(right: 4),
                        child: ElevatedButton(
                            onPressed: () {
                              jsonHandler.writeOverlay('winsLeft', '2');
                            },
                            child: const Text('2')),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          jsonHandler.writeOverlay('winsLeft', '3');
                        },
                        child: const Text('3'),
                      ),
                    ],
                  )
                ],
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Text(
                        "Week",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 17),
                      ),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 20,
                        height: 50,
                        child: TextField(
                          controller: week,
                          decoration: InputDecoration(
                            border: UnderlineInputBorder(),
                            focusedBorder: UnderlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.white, width: 2.0),
                            ),
                            enabledBorder: UnderlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.white, width: 2.0),
                            ),
                            hintText: 'Week',
                            hintStyle: TextStyle(color: Colors.white),
                          ),
                          style: TextStyle(color: Colors.white),
                          textAlign: TextAlign.center,
                          onChanged: (value) =>
                              jsonHandler.writeOverlay('week', value),
                        ),
                      )
                    ],
                  ),
                ],
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  const Row(
                    children: [
                      Text(
                        "Right Team",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 20),
                      ),
                    ],
                  ),
                  const Row(
                    children: [
                      Text(
                        "Wins",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 17),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(right: 4),
                        child: ElevatedButton(
                            onPressed: () {
                              jsonHandler.writeOverlay('winsRight', '0');
                            },
                            child: const Text('0')),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(right: 4),
                        child: ElevatedButton(
                            onPressed: () {
                              jsonHandler.writeOverlay('winsRight', '1');
                            },
                            child: const Text("1")),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(right: 4),
                        child: ElevatedButton(
                            onPressed: () {
                              jsonHandler.writeOverlay('winsRight', '2');
                            },
                            child: const Text('2')),
                      ),
                      ElevatedButton(
                          onPressed: () {
                            jsonHandler.writeOverlay('winsRight', '3');
                          },
                          child: const Text('3')),
                    ],
                  )
                ],
              )
            ],
          )
        ],
      ),
    );
  }
}
