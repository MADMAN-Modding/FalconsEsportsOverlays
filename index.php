<!DOCTYPE html>
<html lang="en">

<?php
$jsonData = json_decode(file_get_contents("json/overlay.json"), true);
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <meta http-equiv="refresh" content="5"> -->
    <title>DCScoreboardOverlay</title>
    <link href="css/index.css" type="text/css" rel="stylesheet">
    <?php
    echo "<link href=\"css/" . strtolower($jsonData["overlay"]) . ".css\" type=\"text/css\" rel=\"stylesheet\">";
    ?>
    <script src="js/index.js" type="module"></script>
</head>

<body>
    <!-- Top Left Info -->
    <div id="topLeftWingRightTrapezoid"></div>
    <div id="topLeftWingLeftRectangle"></div>
    <div id="middleLeftWingRightTrapezoid"></div>
    <div id="middleLeftWingLeftRectangle"></div>
    <div id="bottomLeftWingRightTrapezoid"></div>
    <div id="bottomLeftWingLeftRectangle"></div>

    <!-- Top Right Info -->
    <div id="topRightWingLeftTrapezoid"></div>
    <div id="topRightWingRightRectangle"></div>
    <div id="middleRightWingLeftTrapezoid"></div>
    <div id="middleRightWingRightRectangle"></div>
    <div id="bottomRightWingLeftTrapezoid"></div>
    <div id="bottomRightWingRightRectangle"></div>

    <!-- Away Score -->
    <div id="awayScore"></div>

    <!-- Home Score -->
    <div id="homeScore"></div>

    <!-- Week -->
    <div id="weekBackTrapezoidTop"></div>
    <div id="weekBackRectangleBottom"></div>
    <div id="weekNumberTrapezoid"></div>
    <div id="weekText">Week</div>

    <!-- Temp Images -->
    <img id="topTemp" src="images/KartTemp.jpg">
    <img id="bottomTemp" src="images/KartTemp.jpg">

    <!--Top Names -->
    <div id="topNamesLeftTrapezoid"></div>
    <div id="topNamesRightRectangle"></div>

    <!-- Bottom Names -->
    <div id="bottomNamesRightTrapezoid"></div>
    <div id="bottomNamesLeftRectangle"></div>


    <?php
    // Echos the json data
    foreach ($jsonData as $jsonDataName => $overlayEntryValue) {
        echo "<h1 id=\"$jsonDataName\">$overlayEntryValue</h1>";
    }
    ?>



    <!-- Left Scores -->
    <!-- <div id="scoreLeftThree"></div>
    <div id="scoreLeftTwo"></div>
    <div id="scoreLeftOne"></div> -->


    <!-- Right Scores -->
    <!-- <div id="scoreRightThree"></div>
    <div id="scoreRightTwo"></div>
    <div id="scoreRightOne"></div> -->

    <!-- ScoreBoard -->
</body>

</html>