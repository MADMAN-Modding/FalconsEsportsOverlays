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
    echo  "<script src=\"js/" . strtolower($jsonData["overlay"]) . ".js\"></script>"
    ?>
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

    <img src="images/Esports-Logo.png" id="falconLogo">
    <div class="scoreboardT"></div>
    <div class="scoreboardB"></div>
    <div class="scoretrackerL"></div>
    <div id="rightScore1"></div>
    <div id="rightScore2"></div>
    <div id="leftScore1"></div>
    <div id="leftScore2"></div>
    <div id="namePlateLeftSlope"></div>
    <div id="namePlateLeft"></div>
    <div id="namePlateRightSlope"></div>
    <div id="namePlateRight"></div>

    <?php
    // Echos the json data
    foreach ($jsonData as $jsonDataName => $overlayEntryValue) {
        echo "<h1 id=\"$jsonDataName\">$overlayEntryValue</h1>";
    }
    ?>

    <script src="js/index.js" type="module"></script>

</body>

</html>