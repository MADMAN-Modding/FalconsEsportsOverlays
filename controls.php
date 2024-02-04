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
    <form method="get">
        <center>
            <input type="submit" class="overlay" id="overlay" name="overlay" value="SSBU" style="background-image: url('images/SSBU.png')">
        </center>
    </form>

    <!-- JSON Data Retriever -->
    <?php

    $jsonData = json_decode(file_get_contents("json/overlay.json"), true);

    // Values to retrieve from the JSON
    $valueArrayNames = array("teamNameLeft", "teamNameRight", "scoreLeft", "scoreRight", "teamColorRight", "overlay");

    for ($i = 0; $i < count($valueArrayNames); $i++) {
        $valueArray[$i] = $jsonData[$valueArrayNames[$i]];
    }

    // Sets the values to equal the respective array value
    $teamNameLeft = $valueArray[0];
    $teamNameRight = $valueArray[1];
    $scoreLeft = $valueArray[2];
    $scoreRight = $valueArray[3];
    $teamColorRight = $valueArray[4];
    $overlay = $valueArray[5];
    ?>

    <?php

    echo "<form method=\"post\" action=\"controls.php\">";

    // If i is even it opens the center tag

    // Scores
    echo "<center>";
    echo "<h2 class=\"submit\">Scores</h2>";

    // Left Score
    echo "<h2>Left Score</h2>";
    for ($ii = 0; $ii <= 3; $ii++) {
        echo "<input type=\"radio\" id=\"scoreLeft$ii\" name=\"scoreLeft\" value=\"$ii\" required> $ii";
    }

    // Right Score
    echo "<h2>Right Score</h2>";
    for ($ii = 0; $ii <= 3; $ii++) {
        echo "<input type=\"radio\" id=\"scoreRight$ii\" name=\"scoreRight\" value=\"$ii\" required> $ii";
    }
    echo "</center>";

    // Teams
    echo "<center>";
    echo "<center>";
    echo "<h2>Team Names</h2>";
    echo "</center>";
    echo "<input type=\"text\" id=\"teamNameLeft\" name=\"teamNameLeft\" value=\"$valueArray[0]\">";
    echo "<input type=\"text\" id=\"teamNameRight\" name=\"teamNameRight\" value=\"$valueArray[1]\">";
    echo "</center>";

    // Right team color picker
    echo "<center>";
    echo "<h2 class=\"submit\">Right Team Color</h2>";
    echo "</center>";

    echo "<center>";
    echo "<input type=\"color\" id=\"teamColorRight\" value=\"$valueArray[4]\">";
    echo "</center>";
    echo "</form>";
    ?>

    <!-- AJAX Writer -->
    <script>
        function radioButtonCheck(buttonSide, buttonNumber) {
            let button = document.getElementById("score" + buttonSide + buttonNumber);

            if (button.checked == true && buttonSide == "Left") {
                scoreLeft = buttonNumber;
            } else if (button.checked == true && buttonSide == "Right") {
                scoreRight = buttonNumber;
            }
        }

        function jsonWrite() {

            // Gets values for their respective side
            let teamNameLeft = document.getElementById("teamNameLeft").value;
            let teamNameRight = document.getElementById("teamNameRight").value;

            teamColorRightValue = document.getElementById("teamColorRight");

            teamColorRight = teamColorRightValue.value;

            console.log(teamColorRight);

            teamColorRight = teamColorRight.replace("#", "!");


            <?php

            // Writes radioButtonCheck functions
            for ($i = 0; $i < 4; $i++) {
                echo "radioButtonCheck(\"Left\", \"$i\"); ";
                echo "radioButtonCheck(\"Right\", \"$i\"); ";
            }

            function AJAXFormMaker($value)
            {
                // Makes an object for the request
                echo "var xmlhttp = new XMLHttpRequest();";
                // Makes the form
                echo "xmlhttp.open(\"GET\", \"jsonWriter.php?$value=\" + $value, true);";
                // Sends the data
                echo "xmlhttp.send();";
            }

            // Makes the forms for the teams
            AJAXFormMaker("teamNameLeft");
            AJAXFormMaker("teamNameRight");
            AJAXFormMaker("scoreLeft");
            AJAXFormMaker("scoreRight");
            AJAXFormMaker("teamColorRight");
            ?>
        }
    </script>

    <div style="text-align: center;" onclick="jsonWrite()">Submit</div>

</body>

</html>