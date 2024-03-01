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
    // echo "<link href=\"css/" . strtolower($jsonData["overlay"]) . ".css\" type=\"text/css\" rel=\"stylesheet\">";
    // echo  "<script src=\"js/" . strtolower($jsonData["overlay"]) . ".js\"></script>"
    ?>
</head>

<body>
    <script src="js/index.js" type="module"></script>
    <script id="js"></script>
</body>

</html>