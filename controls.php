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
    <!-- ColorIs -->
        <link rel="stylesheet" href="coloris.min.css"/>
        <script src="coloris.min.js"></script>
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

    // Counter for how many times it has made a form
    $formArrayInt = 0;

    // List of the names to display
    $formArrayNiceNames = array("Scores", "Teams");

    // Counter for how many times it made an h2 tag
    $formArrayNiceNamesInt = 0;

    echo "<form method=\"post\" action=\"controls.php\">";

    // Foreach loop that makes the forms 
    foreach ($formArray as $list) {

        // If the int is even it opens the center tag
        if ($formArrayInt % 2 == 0 || $formArrayInt == 0) {
            echo "<center>";
            echo "<h2 class=\"submit\">" . $formArrayNiceNames[$formArrayNiceNamesInt] . "</h2>";
        }

        // Makes the inputs
        if ($formArrayInt <= 1) {
            echo "<input type=\"number\" id=\"numberInput\" name=\"" . $formArray[$formArrayInt] . "\" value=\"" . $formArrayValues[$formArrayInt] . "\" required>";
        } else {
            echo "<input type=\"text\" id=\"stringInput\" name=\"" . $formArray[$formArrayInt] . "\" value=\"" . $formArrayValues[$formArrayInt] . "\">";
        }

        // Increments by one
        $formArrayInt++;

        // If the int is even it closes the center tag
        if ($formArrayInt % 2 == 0 || $formArrayInt == 0) {
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