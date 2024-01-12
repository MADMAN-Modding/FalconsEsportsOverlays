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
    <form method="post">
        <center>
            <div class="row">
                <div class="col-lg-4">
                    <input type="submit" class="overlay" name="overlay" value="SSBU" style="background-image: url('images/SSBU.png');">
                </div>
                <div class="col-lg-4">
                    <input type="submit" class="overlay" name="overlay" value="SPLAT" style="background-image: url('images/SPLAT.png');" />
                </div>
                <div class="col-lg-4">
                    <input type="submit" class="overlay" name="overlay" value="RL" style="background-image: url('images/RL.png');" />
                </div>

            </div>
        </center>

        <center>
            <div class="row">
                <div class="col-lg-6">
                    <input type="submit" class="overlay" name="overlay" value="VAL" style="background-image: url('images/VAL.png');" />
                </div>
                <div class="col-lg-6">
                    <input type="submit" class="overlay" name="overlay" value="DC" style="background-image: url('images/DC.png');" />
                </div>
            </div>
        </center>
    </form>

    <!-- Data Checking PHP -->
    <?php

    // Opens the json file
    $jsonData = json_decode(file_get_contents("overlay.json"), true);


    // Lists of all the POSTS to look for
    $valueArray = array("teamNameLeft", "teamNameRight", "scoreLeft", "scoreRight", "overlay", "teamColorRight");

    // Integer for where in the valueArray to look  
    $valueArrayInt = 0;

    // Foreach loop that assigns the variables for scores, teams, and win/lost
    foreach ($valueArray as $list) {
        if (isset($_POST["$list"])) {
            $valueArrayOutput[$valueArrayInt] = $_POST[$list];
        } else {
            // If the values weren't posted than they will grab their values from the json
            // This sets the respective value to the correct json spot by getting the array name from $valueArray
            $valueArrayOutput[$valueArrayInt] = $jsonData[$valueArray[$valueArrayInt]];
        }
        // Increments the array value
        $valueArrayInt++;
    }

    // Sets the values to equal the respective array value
    $teamNameLeft = $valueArrayOutput[0];
    $teamNameRight = $valueArrayOutput[1];
    $scoreLeft = $valueArrayOutput[2];
    $scoreRight = $valueArrayOutput[3];
    $overlay = $valueArrayOutput[4];
    $teamColorRight = $valueArrayOutput[5];

    // Array for json
    $dataArray = [
        "teamNameLeft" => "$teamNameLeft",
        "teamNameRight" => "$teamNameRight",
        "scoreLeft" => "$scoreLeft",
        "scoreRight" => "$scoreRight",
        "overlay" => "$overlay",
        "teamColorRight" => "$teamColorRight"
    ];

    // Encode the JSON data
    $jsonDataEncoded = json_encode($dataArray, JSON_PRETTY_PRINT);

    // Open the JSON file for writing
    $jsonOpener = fopen("overlay.json", "w");

    // Write the JSON data to the file
    fwrite($jsonOpener, $jsonDataEncoded);

    // Close the file
    fclose($jsonOpener);
    ?>

    <!-- Dynamic Form Creation PHP -->

    <?php

    // Array of all the form names
    $formArray = array("scoreLeft", "scoreRight", "teamNameLeft", "teamNameRight");

    // Array of all the forms individual value's
    $formArrayValues = array($scoreLeft, $scoreRight, $teamNameLeft, $teamNameRight);

    // List of the names to display
    $formArrayNiceNames = array("Scores", "Teams");

    // Counter for how many times it made an h2 tag
    $formArrayNiceNamesInt = 0;

    echo "<form method=\"post\" action=\"controls.php\">";

    // Foreach loop that makes the forms 
    for ($i = 0; $i < count($formArray); $i++) {

        // If i is even it opens the center tag
        if ($i % 2 == 0 || $i == 0) {
            echo "<center>";
            echo "<h2 class=\"submit\">$formArrayNiceNames[$formArrayNiceNamesInt]</h2>";
        }

        // Makes the inputs
        switch ($i) {
            case 0: {
                    echo "<h2>Left Score</h2>";
                    for ($ii = 0; $ii <= 3; $ii++) {
                        echo "<input type=\"radio\" id=\"radioLeft$ii\" name=\"$formArray[$i]\" value=\"$ii\" required> $ii";       
                    }
                    break;
                }

            case 1: {
                    echo "<h2>Right Score</h2>";
                    for ($ii = 0; $ii <= 3; $ii++) {
                        echo "<input type=\"radio\" id=\"radioRight$ii\" name=\"$formArray[$i]\" value=\"$ii\" required> $ii";       
                    }
                    break;
                }

            default: {
                    echo "<input type=\"text\" id=\"stringInput\" name=\"$formArray[$i]\" value=\"$formArrayValues[$i]\">";
                    break;
                }
        }

        // If i is odd it closes the center tag
        if ($i % 2 == 0 || $i == 0) {
        } else {
            echo "</center>";
            $formArrayNiceNamesInt++;
        }
    }

    // Right team color picker

    echo "<center>";
    echo "<h2 class=\"submit\">Right Team Color</h2>";
    echo "</center>";

    echo "<center>";
    echo "<input type=\"color\" name=\"teamColorRight\" value=\"$teamColorRight\">";
    echo "</center>";


    // Makes the form sumbition button and closes the form
    echo "<center>";
    echo "<button type=\"submit\" class=\"submit\">Update Values</button>";
    echo "</center>";

    echo "</form>";
    ?>

</body>

</html>