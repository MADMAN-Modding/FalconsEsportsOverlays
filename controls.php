<!DOCTYPE html>

<html>

<head>
    <title>Controls</title>

    <!--Bootstrap5-->
    <!-- Latest compiled and minified CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Latest compiled JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>

    <link href="css/controls.css" type="text/css" rel="stylesheet">
    <script src="js/controls.js"></script>
</head>

<body>
    <center>
        <img src="images/SSBU.png" class="overlay" id="ssbu" onclick="overlaySender('ssbu')">
        <img src="images/Kart.png" class="overlay" id="kart" onclick="overlaySender('kart')">
        <img src="images/RL.png" class="overlay" id="rocketLeague" onclick="overlaySender('rocketLeague')">
    </center>
    <!-- JSON Data Retriever -->
    <?php

    $jsonData = json_decode(file_get_contents("json/overlay.json"), true);

    echo "<div class=\"form\">";
    echo "<form method=\"post\" action=\"controls.php\">";

    // Left win loops to make all the radio buttons
    echo "<h2>Left Wins</h2>";
    for ($i = 0; $i <= 3; $i++) {
        formMaker("radio", "winsLeft$i", $i, "winsLeft", $i);
    }

    // Right win loops to make all the radio buttons
    echo "<h2>Right Wins</h2>";
    for ($i = 0; $i <= 3; $i++) {
        formMaker("radio", "winsRight$i", $i, "winsRight", $i);
    }

    echo "<h2>Left and Right Scores</h2>";
    formMaker("number", "scoreLeft", $jsonData["scoreLeft"], "scoreLeft", "");
    formMaker("number", "scoreRight", $jsonData["scoreRight"], "scoreRight", "");

    // Teams
    echo "<h2 style=\"text-align: center;\">Team Names</h2>";

    // Makes the input with the value stored in the JSON file
    formMaker("text", "teamNameLeft", $jsonData["teamNameLeft"], "teamNameLeft", "");

    // Makes the input with the value stored in the JSON file
    formMaker("text", "teamNameRight", $jsonData["teamNameRight"], "teamNameRight", "");

    // Player Names
    echo "<h2 style=\"text-align: center;\">Player Names</h2>";
    // Left
    formMaker("text", "playerNamesLeft", $jsonData["playerNamesLeft"], "playerNamesLeft", "");

    // Right
    formMaker("text", "playerNamesRight", $jsonData["playerNamesRight"], "playerNamesRight", "");

    // Week
    echo "<h2 id=\"weekText\">Week</h2>";
    formMaker("number", "week", $jsonData["week"], "teamNameLeft", "");

    // Left team color picker
    echo "<h2 class=\"submit\">Left Team Color</h2>";
    formMaker("color", "teamColorRight", $jsonData["teamColorLeft"], "teamColorLeft", "");

    // Right team color picker
    echo "<h2 class=\"submit\">Right Team Color</h2>";

    // Makes the input with the value stored in the JSON file
    formMaker("color", "teamColorRight", $jsonData["teamColorRight"], "teamColorRight", "");
    echo "</form>";
    echo "</div>";
    ?>

    <!-- AJAX Writer -->
    <script>
        // Checks which button is checked and sets the variable respectively
        function radioButtonCheck(buttonSide, buttonNumber) {
            let button = document.getElementById("wins" + buttonSide + buttonNumber);

            if (button.checked == true && buttonSide == "Left") {
                winsLeft = buttonNumber;
            } else if (button.checked == true && buttonSide == "Right") {
                winsRight = buttonNumber;
            }
        }

        function jsonWrite() {
            // // Took 2 hours but this gets the value across to the jsonWriter
            // let teamColorRight = document.getElementById("teamColorRight").value.replace("#", "!");

            <?php

            // Writes radioButtonCheck functions
            for ($i = 0; $i < 4; $i++) {
                echo "radioButtonCheck(\"Left\", \"$i\"); ";
                echo "radioButtonCheck(\"Right\", \"$i\"); ";
            }

            letMaker("teamNameLeft", "");
            letMaker("teamNameRight", "");
            AJAXFormMaker("winsLeft");
            AJAXFormMaker("winsRight");
            letMaker("teamColorLeft", ".replace('#', '!'");
            letMaker("teamColorRight", ".replace('#', '!')");
            letMaker("week", "");
            letMaker("scoreLeft", "");
            letMaker("scoreRight", "");
            letMaker("playerNamesLeft", "");
            letMaker("playerNamesRight", "");

            function letMaker($value, $options) {
                echo "let $value = document.getElementById('$value').value$options; ";

                AJAXFormMaker("$value");
            }

            function AJAXFormMaker($value)
            {
                // Makes an object for the request
                echo "var xmlhttp = new XMLHttpRequest(); ";
                echo "xmlhttp.open(\"GET\", \"jsonWriter.php?$value=\" + $value, true); ";
                echo "xmlhttp.send(); ";
            }

            function formMaker($type, $id, $value, $name, $text)
            {
                echo "<input type=\"$type\" id=\"$id\" value=\"$value\" name=\"$name\" required> $text";
            }
            ?>
        }
    </script>
    <p style="text-align: center;" onclick="jsonWrite()" class="submit">Submit</p>

</body>

</html>