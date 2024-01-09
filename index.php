<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <meta http-equiv="refresh" content="3"> -->
    <title>DCScoreboardOverlay</title>
    <script src="js/index.js" type="module">main()</script>
</head>

<body>
    <?php
    $test = "leftScore";

    // Echos the json data
    $jsonData = json_decode(file_get_contents("overlay.json"), true);

    // $jsonDataCounter = 0;

    foreach ($jsonData as $jsonDataName => $overlayEntryValue) {
        echo "<h1 class=\"$jsonDataName h1\">$overlayEntryValue</h1>";

        // if($jsonDataCounter == 2) {
            // echo "<div class=\"$jsonDataName$overlayEntryValue\"></div>";
            // echo "<h1 style=\"color: black;\">$jsonDataName" . "$overlayEntryValue</h1>";
        // }

        // if ("$jsonDataName" == "leftScore") {
        //     echo "test";
        //     if ($overlayEntryName == "3") {
        //         echo "<div class=\"leftScoreThree\"></div>";
        //     }
        // }

        // $jsonDataCounter++;
    }

    echo "<center>";
        echo '<img src="images/newSmashOverlay.png" class="overlayImage">';
    echo "</center>";

    ?>

    <script>main()</script>

    <div id="scoreLeftThree"></div>

    <style>
        html {
            margin: auto;
        }

        body {
            background-color: transparent;
            /* overflow: hidden; */
            color: white;
            width: 1920px;
            margin: auto;
            height: 1080px;
        }

        #logo {
            position: absolute;
            top: 5px;
            left: 2047px;
            width: 10%;

        }

        h1 {
            text-shadow: 2px 2px 2px black;
        }

        .scoreLeft,
        .teamNameLeft {
            width: 390px;
            margin-left: 1672px;
            text-align: right;
            position: absolute;

        }

        .scoreRight,
        .teamNameRight {
            width: 390px;
            text-align: left;
            position: absolute;
            margin-left: 745px;
        }


        .scoreLeft {
            top: 28px;
            height: 50px;
            text-align: left;
            display: none;
        }


        .scoreRight {
            top: 28px;
            height: 50px;
            text-align: right;
            display: none;
        }

        .teamNameLeft {
            top: 28px;
            height: 50px;
            margin-left: 357px;
        }

        .teamNameRight {
            top: 28px;
            height: 50px;
            text-align: right;
            left: 275px;
            /* margin-right: 1110px; */
        }

        .overlay {
            display: none;
        }

        .overlayImage {
            display: block;
            z-index: 999;
        }

        .leftScoreOne {
            width: 20px;
            height: 40px;
            background-color: red;
            z-index: 1000;
            left: 700px;
            top: 150px;
            transform: rotate(-15deg);
            display: block;
            position: absolute;
        }

        #scoreLeftThree {
            position: absolute;
            top: 150px;
            left: 680px;
            background-color: orange;
            width: 23px;
            height: 37px;
            transform: skewX(31.5deg);

        }
    </style>
</body>

</html>