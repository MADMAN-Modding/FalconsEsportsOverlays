<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
    <!-- <meta http-equiv="refresh" content="5"> -->
    <title>DCScoreboardOverlay</title>
    <link href="css/index.css" type="text/css" rel="stylesheet">
</head>

<body>
<?php 
    if(!file_exists('json/overlay.json')) {
        fwrite(fopen('json/overlay.json', 'w'), json_encode([
            "teamNameLeft" => "DC Falcons Red",
            "teamNameRight" => "That other team",
            "winsLeft" => "0",
            "winsRight" => "0",
            "teamColorRight" => "#FFFFFF",
            "overlay" => "kart",
            "week" => "0",
            "scoreLeft" => "0",
            "scoreRight" => "0",
            "playerNamesLeft" => "MADMAN-Modding",
            "playerNamesRight" => "go to the controls.php page or set the values in the app"
        ], JSON_PRETTY_PRINT));
    }
    ?>

    <iframe src="" id="overlayiFrame" frameborder="0"></iframe>



<script src="js/index.js" type="module"></script>

</body>

</html>
