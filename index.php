<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <meta http-equiv="refresh" content="3"> -->
    <title>DCScoreboardOverlay</title>
    <link href="css/index.css" type="text/css" rel="stylesheet">
    <script src="js/index.js" type="module"></script>
</head>

<body>
    <?php
    // Echos the json data
    $jsonData = json_decode(file_get_contents("overlay.json"), true);

    foreach ($jsonData as $jsonDataName => $overlayEntryValue) {
        echo "<h1 id=\"$jsonDataName\">$overlayEntryValue</h1>";
    }
    ?>

    <center>
        <img src="images/newSmashOverlay.png" class="overlayImage">
    </center>

    <div id="scoreLeftThree"></div>
</body>

</html>