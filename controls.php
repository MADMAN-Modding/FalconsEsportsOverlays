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
    </center>
    <!-- JSON Data Retriever -->
    <?php

    $jsonData = json_decode(file_get_contents("json/overlay.json"), true);

    // Values to retrieve from the JSON
    $valueArrayNames = array("teamNameLeft", "teamNameRight", "winsLeft", "winsRight", "teamColorRight", "overlay", "week", "scoreLeft", "scoreRight");

    for ($i = 0; $i < count($valueArrayNames); $i++) {
        $valueArray[$i] = $jsonData[$valueArrayNames[$i]];
    }
    ?>

    <?php

    echo "<div class=\"form\">";
    echo "<form method=\"post\" action=\"controls.php\">";

    function formMaker($type, $id, $value, $name, $text)
    {
        echo "<input type=\"$type\" id=\"$id\"value=\"$value\" name=\"$name\" required> $text";
    }

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
    formMaker("number", "scoreLeft", $valueArray[7], "scoreLeft", "");
    formMaker("number", "scoreRight", $valueArray[8], "scoreRight", "");

    // Teams
    echo "<h2 style=\"text-align: center\">Team Names</h2>";

    // Makes the input with the value stored in the JSON file
    echo "<input type=\"text\" id=\"teamNameLeft\" name=\"teamNameLeft\" value=\"$valueArray[0]\">";

    // Makes the input with the value stored in the JSON file
    formMaker("text", "teamNameRight", $valueArray[1], "teamNameRight", "");

    // Week
    echo "<h2 id=\"weekText\">Week</h2>";
    formMaker("number", "week", $valueArray[6], "teamNameLeft", "");

    // Right team color picker
    echo "<h2 class=\"submit\">Right Team Color</h2>";

    // Makes the input with the value stored in the JSON file
    formMaker("color", "teamColorRight", $valueArray[4], "teamColorRight", "");
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

            // Gets values for their respective side
            let teamNameLeft = document.getElementById("teamNameLeft").value;
            let teamNameRight = document.getElementById("teamNameRight").value;

            // Took 2 hours but this gets the value across to the jsonWriter
            let teamColorRight = document.getElementById("teamColorRight").value.replace("#", "!");

            let week = document.getElementById("week").value;
            let scoreLeft = document.getElementById("scoreLeft").value;
            let scoreRight = document.getElementById("scoreRight").value;

            <?php

            // Writes radioButtonCheck functions
            for ($i = 0; $i < 4; $i++) {
                echo "radioButtonCheck(\"Left\", \"$i\"); ";
                echo "radioButtonCheck(\"Right\", \"$i\"); ";
            }

            function AJAXFormMaker($value)
            {

                // Makes an object for the request
                echo "var xmlhttp = new XMLHttpRequest(); ";
                echo "xmlhttp.open(\"GET\", \"jsonWriter.php?$value=\" + $value, true); ";
                echo "xmlhttp.send(); ";
            }

            // Makes the forms for the teams
            AJAXFormMaker("teamNameLeft");
            AJAXFormMaker("teamNameRight");
            AJAXFormMaker("winsLeft");
            AJAXFormMaker("winsRight");
            AJAXFormMaker("teamColorRight");
            AJAXFormMaker("week");
            AJAXFormMaker("scoreLeft");
            AJAXFormMaker("scoreRight");
            ?>

        }
    </script>
    <p style="text-align: center;" onclick="jsonWrite()" class="submit">Submit</p>

</body>

</html>