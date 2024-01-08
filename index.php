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
        html {
            /* Determined from image width of the overlay */
            width: 1157px;
            margin: auto;
        }

        body {
            background-color: transparent;
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

        .scoreLeft,.teamNameLeft {
            width: 390px;
            margin-left: 15px;
            text-align: right;
            position: absolute;

        }

        .scoreRight,.teamNameRight {
            width: 390px;
            text-align: left;
            position: absolute;
            margin-left: 745px;
        }


        .scoreLeft {
            top: 28px;
            height: 50px;
            text-align: left;
        }


        .scoreRight {
            top: 28px;
            height: 50px;
            text-align: right;
        }

        .teamNameLeft {
            top: 28px;
            height: 50px;
            margin-left: 20px;
        }

        .teamNameRight {
            top: 28px;
            height: 50px;
            margin-right: 10px;
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