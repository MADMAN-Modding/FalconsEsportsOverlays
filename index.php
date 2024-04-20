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
            '"teamNameLeft" => "",
            "teamNameRight" => "",
            "winsLeft" => "",
            "winsRight" => "",
            "teamColorRight" => "",
            "overlay" => "kart",
            "week" => "",
            "scoreLeft" => "",
            "scoreRight" => "",
            "playerNamesLeft" => "",
            "playerNamesRight" => ""'
        ], JSON_PRETTY_PRINT));
    }
    ?>

    <iframe src="" id="overlayiFrame" frameborder="0"></iframe>



<script src="js/index.js" type="module"></script>

</body>

</html>
