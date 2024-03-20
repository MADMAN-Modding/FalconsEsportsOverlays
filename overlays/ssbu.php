<!DOCTYPE html>
<?php
$jsonData = json_decode(file_get_contents("../json/overlay.json"), true);
?>
<html>

<head lang="en">
    <title>SSBU</title>
    <link href="../css/ssbu.css" rel="stylesheet" type="text/css">
    <link href="../css/index.css" rel="stylesheet" type="text/css">
</head>

<body>
    <!--Smash Specific html-->

    <div class="scoreboardT"></div>
    <div class="scoreboardB"></div>
    <div class="scoretrackerL"></div>
    <div id="rightRoundsWon1"></div>
    <div id="rightRoundsWon2"></div>
    <div id="leftRoundsWon1"></div>
    <div id="leftRoundsWon2"></div>
    <div id="namePlateLeftSlope"></div>
    <div id="namePlateLeft"></div>
    <div id="namePlateRightSlope"></div>
    <div id="namePlateRight"></div>
    <img src="../images/Esports-Logo.png" id="falconLogo">

    <?php
    // Echos the json data
    foreach ($jsonData as $jsonDataName => $overlayEntryValue) {
        echo "<h1 id=\"$jsonDataName\">$overlayEntryValue</h1>";
    }
    ?>

    <script src="../js/ssbu.js" type="module"></script>
</body>

</html>