<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="3">
    <title>DCScoreboardOverlay</title>

    <?php
        $csvArray = array();

        if(($handle = fopen("data.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $csvArray[] = $data;
            }
        }

        fclose($handle);

        // This is for if there were multiple rows
        // for ($i = 1; $i < count($csvArray); $i++) {
            for ($ii = 0; $ii < count($csvArray[1])-1; $ii++) {
                echo "<h1 class=" . $csvArray[0][$ii] . ">" . $csvArray[1][$ii] . "</h1>";
            }
        // }

        // All of these read the overlay and use a different image for the middle depending on what it is, none of these are case sensitive
        // If no correct arguement is found, it will default to the DC logo

        //$overlayArray = array("DC", "SSBU", "RL", "SPLAT", "VAL");

        // Fancy foreach loop to check the overlay value
        //foreach ($overlayArray as $list) {
        //    if (strtoupper($csvArray[1][4]) == $list) {
        //      echo "<img id=\"logo\" src=\"images/" . strtoupper($list) . ".png\">";
        //    }
       // }

        // Checks the left for won or lost status
        // if(strtolower($csvArray[2][0]) == "won" || strtolower($csvArray[2][0]) == "win") {
        //     echo '<img class="wonLeft" src="images/[W].png">';
        // }   elseif(strtolower($csvArray[2][0]) == "lost" || strtolower($csvArray[2][0]) == "lose") {
        //     echo '<img class="lostLeft" src="images/[L].png">';
        // }

        // Checks the right for won or lost status
        // if(strtolower($csvArray[2][1]) == "won" || strtolower($csvArray[2][1]) == "win") {
        //     echo '<img class="wonRight" src="images/[W].png">';
        // }   elseif(strtolower($csvArray[2][1]) == "lost" || strtolower($csvArray[2][1]) == "lose") {
        //     echo '<img class="lostRight" src="images/[L].png">';
        // }
    ?>

    <style>
        body {
            background-color: transparent;
            width: 1920px;
        }

        #logo {
            position: absolute;
            top: 5px;
            left: 890px;
            width: 10%;

        }
        h1{
            text-shadow: 2px 2px 2px black;
        }

        .scoreLeft {
            position:absolute;
            top:32px;
            left:400px;
            width: 50px;
            height: 50px;
            z-index: 1000;
        }


        .scoreRight  {
            position:absolute;
            z-index: 1000;
            top:32px;
            right:500px;
            width: 50px;
            height: 50px;
        }
           
        .teamNameLeft  {
            position:absolute;
            z-index: 1000;
            top:32px;
            left:457.5px;
            height: 50px;
            color: white;
        }

        .teamNameRight  {
            position:absolute;
            z-index: 1000;
            top:32px;
            right:567.5px;
            height: 50px;
            color: white;
        }
        /*left over code from win/lose overlay. Will remove in future update.
        /* .wonLeft, .lostLeft {
            position: absolute;
            z-index: 1000;
            left: 670px;
            top: 125px;
        }
        
        .wonRight, .lostRight {
            position: absolute;
            z-index: 1000;
            right: 670px;
            top: 125px;
        } */

    </style>
    <!--1920x1080-->
</head>
    <body>
        <img src="images/newSmashOverlay1920x1080.png">
    </body>
</html>