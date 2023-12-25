<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="3">
    <title>DCScoreboardOverlay</title>
</head>

<body>
    <?php
    // Echos the json data
    $jsonData = json_decode(file_get_contents("overlay.json"), true);

    foreach ($jsonData as $jsonData => $overlayEntryName) {
        echo "<h1 class=\"$jsonData\">$overlayEntryName</h1>";
    }

    ?>

    <!-- Score numbers go from left to right -->
    <!-- <div class="leftScoreOne"></div> -->

    <center>
        <img src="images/newSmashOverlay.png" class="overlayImage">
    </center>

    <style>
        body {
            background-color: transparent;
            width: 1920px;
            overflow: hidden;
            color: white;
        }

        #logo {
            position: absolute;
            top: 5px;
            left: 890px;
            width: 10%;

        }

        h1 {
            text-shadow: 2px 2px 2px black;
        }

        .scoreLeft {
            position: absolute;
            top: 28px;
            left: 407px;
            width: 50px;
            height: 50px;
            z-index: 999;
        }


        .scoreRight {
            position: absolute;
            z-index: 999;
            top: 28px;
            right: 380px;
            width: 50px;
            height: 50px;
        }

        .teamNameLeft {
            position: absolute;
            z-index: 999;
            top: 28px;
            left: 487.5px;
            height: 50px;
        }

        .teamNameRight {
            position: absolute;
            z-index: 999;
            top: 28px;
            right: 457.5px;
            height: 50px;
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
    </style>
</body>

</html>