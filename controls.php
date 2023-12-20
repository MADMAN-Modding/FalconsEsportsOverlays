<html>
    <head>
    <title>Controls</title>

    <!--Bootstrap5-->
        <!-- Latest compiled and minified CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">

        <!-- Latest compiled JavaScript -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script> 
    </head>
    <body>
        <form method="post" >
            <center>
                <div class="row">
                    <div class="col-lg-4">
                        <input type="submit" class="overlay" name="overlay" value="SSBU" style="background-image: url('images/SSBU.png');">
                    </div>
                    <div class="col-lg-4">
                        <input type="submit" class="overlay" name="overlay" value="SPLAT" style="background-image: url('images/SPLAT.png');"/>
                    </div>
                    <div class="col-lg-4">
                        <input type="submit" class="overlay" name="overlay" value="RL" style="background-image: url('images/RL.png');"/> 
                    </div>
                    
                </div>
            </center>

            <center>
                <div class="row">
                    <div class="col-lg-6">
                        <input type="submit" class="overlay" name="overlay" value="VAL" style="background-image: url('images/VAL.png');"/>
                    </div>
                    <div class="col-lg-6">
                        <input type="submit" class="overlay" name="overlay" value="DC" style="background-image: url('images/DC.png');"/>
                    </div>
                </div>
            </center>
        </form>

    <style>
        body {
            margin-top: 10px;
            max-width: 1920px;
            margin-left: auto;
            margin-right: auto;
            overflow-y: scroll;
            overflow-x: hidden;
            background-color: darkgray;
        }

        .overlay {
            border:none;
            background-repeat:no-repeat;
            background-size:100% 100%;
            width: 300px;
            height: 300px;
            background-color: transparent;
            color: transparent;
        }

        .submit {
            margin-top: 10px;
        }
    </style>

<!-- Data Checking PHP -->
<?php

    // Sets the csvArray variable to a blank array
    $csvArray = array();

    // Opens the csv file and sets the csvArray to be equal to the current spot in the file
    if(($csvOpener = fopen("data.csv", "r")) !== FALSE) {
        while (($data = fgetcsv($csvOpener, 1000, ",")) !== FALSE) {
            $csvArray[] = $data;
        }
    }

    // Lists of all the POSTS to look for
    $valueArray = array("teamNameLeft", "teamNameRight", "scoreLeft", "scoreRight", "overlay", "winLoseLeft", "winLoseRight");

    // Integer for where in the valueArray to look  
    $valueArrayInt = 0;

    // Foreach loop that assigns the variables for scores, teams, and win/lost
    foreach($valueArray as $list) {
        if(isset($_POST["$list"])) {
            $valueArrayOutput[$valueArrayInt] = $_POST[$list];
        } else {
            // If the values weren't posted than they will grab their values from the csv
            if ($valueArrayInt <= 4) {
                $valueArrayOutput[$valueArrayInt] = $csvArray[1][$valueArrayInt];
            } else {
                $valueArrayOutput[$valueArrayInt] = $csvArray[2][$valueArrayInt-5];
            }
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
    $winLoseLeft = $valueArrayOutput[5];
    $winLoseRight = $valueArrayOutput[6];

    // Array for csv
    $dataArray = array(
        array("teamNameLeft", "teamNameRight", "scoreLeft", "scoreRight", "overlay"),
        array($teamNameLeft, $teamNameRight, $scoreLeft, $scoreRight, $overlay),
        array($winLoseLeft, $winLoseRight)
    );

    // Opens the csv
    $csvFile = fopen("data.csv", "c+");

    // Writes the csv
    foreach ($dataArray as $line) {
        fputcsv($csvFile, $line);
    }
?>

<!-- Dynamic Form Creation PHP -->

<?php

    // Array of all the value names
    $formArray = array("scoreLeft", "scoreRight", "teamNameLeft", "teamNameRight", "winLoseLeft", "winLoseRight");
    
    // Array of all the values individual value's
    $formArrayValues = array($scoreLeft, $scoreRight, $teamNameLeft, $teamNameRight, $winLoseLeft, $winLoseRight);

    // Counter for how many times it has made a form
    $formArrayInt = 0;

    // List of the names to display
    $formArrayNiceNames = array("Scores", "Teams", "Win/Lose");

    // Counter for how many times it made an h2 tag
    $formArrayNiceNamesInt = 0;

    echo "<form method=\"post\" action=\"controls.php\">";

    // Foreach loop that makes the forms 
    foreach ($formArray as $list) {

        // If the int is even it opens the center tag
        if($formArrayInt % 2 == 0 || $formArrayInt == 0) {
            echo "<center>";
            echo "<h2 class=\"submit\">" . $formArrayNiceNames[$formArrayNiceNamesInt] . "</h2>";
        }

        // Makes the inputs
        if ($formArrayInt <=1) {
            echo "<input type=\"number\" id=\"numberInput\" name=\"" . $formArray[$formArrayInt] . "\" value=\"" . $formArrayValues[$formArrayInt] . "\" required>";
        } else {
            echo "<input type=\"text\" id=\"stringInput\" name=\"" . $formArray[$formArrayInt] . "\" value=\"" . $formArrayValues[$formArrayInt] ."\">";
        }

        // Increments by one
        $formArrayInt++;

        // If the int is even it closes the center tag
        if($formArrayInt % 2 == 0 || $formArrayInt == 0) {
            echo "</center>";
            $formArrayNiceNamesInt++;
        } else {
            
        }
    }

    // Makes the form sumbition button and closes the form
    echo "<center>";
        echo "<button type=\"submit\" class=\"submit\">Update Values</button>";
    echo "</center>";
    echo "</form>";

    fclose($csvOpener);

?>

    </body>
</html>
