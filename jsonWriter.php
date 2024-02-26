<?php

// Opens the json file
$jsonData = json_decode(file_get_contents("json/overlay.json"), true);

$valueArrayNames = array();

foreach ($jsonData as $index => $indexValue) {
    isset($_GET["$index"]) ? $valueArray[] = $_GET["$index"] : $valueArray[] = $indexValue; 
}

// String replacement because a # can't be sent using xml
$valueArray[4] = str_replace("!", "#", $valueArray[4]);

// Array for json, this should be in the order of the indicies in the json
$dataArray = [
    "teamNameLeft" => "$valueArray[0]",
    "teamNameRight" => "$valueArray[1]",
    "winsLeft" => "$valueArray[2]",
    "winsRight" => "$valueArray[3]",
    "teamColorRight" => "$valueArray[4]",
    "overlay" => "$valueArray[5]",
    "week" => "$valueArray[6]",
    "scoreLeft" => "$valueArray[7]",
    "scoreRight" => "$valueArray[8]",
    "playerNamesLeft" => "$valueArray[9]",
    "playerNamesRight" => "$valueArray[10]"
];

// Write the JSON data to the file
fwrite(fopen("json/overlay.json", "w"), json_encode($dataArray, JSON_PRETTY_PRINT));

?>
</body>