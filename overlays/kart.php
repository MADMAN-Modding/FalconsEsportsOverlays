<!DOCTYPE html>
<?php
$jsonData = json_decode(file_get_contents("../json/overlay.json"), true);
?>

<html>
<head lang="en">
    <title>Kart</title>
    <link href="../css/kart.css" rel="stylesheet" type="text/css">
    <link href="../css/index.css" rel="stylesheet" type="text/css">
    <script src="../js/index.js"></script>
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

    <!-- Home/Away Text -->
    <h1 id="homeText">Home</h1>
    <h1 id="awayText">Away</h1>

    <!-- Away Score -->
    <div id="awayScore"></div>
    <h1 id="awayScoreText">Score</h1>

    <!-- Home Score -->
    <div id="homeScore"></div>
    <h1 id="homeScoreText">Score</h1>

    <!-- Week -->
    <div id="weekBackTrapezoidTop"></div>
    <div id="weekBackRectangleBottom"></div>
    <div id="weekNumberTrapezoid"></div>
    <div id="weekText">Week</div>

    <!--Top Names -->
    <div id="topNamesLeftTrapezoid"></div>
    <div id="topNamesRightRectangle"></div>

    <!-- Bottom Names -->
    <div id="bottomNamesRightTrapezoid"></div>
    <div id="bottomNamesLeftRectangle"></div>

    <!-- Rounds Won 1 is top 2 is bottom-->
    <div id="leftRoundsWon"></div>
    <div id="leftRoundsWon1"></div>
    <div id="leftRoundsWon2"></div>

    <div id="rightRoundsWon"></div>
    <div id="rightRoundsWon1"></div>
    <div id="rightRoundsWon2"></div>

    <?php
    // Echos the json data
    foreach ($jsonData as $jsonDataName => $overlayEntryValue) {
        echo "<h1 id=\"$jsonDataName\">$overlayEntryValue</h1>";
    }
    ?>

    <script src="js/index.js" type="module"></script>
    <script id="js"></script>
</body>

</html>