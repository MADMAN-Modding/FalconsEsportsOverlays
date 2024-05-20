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
    "teamColorLeft" => "$valueArray[4]",
    "teamColorRight" => "$valueArray[5]",
    "overlay" => "$valueArray[6]",
    "week" => "$valueArray[7]",
    "scoreLeft" => "$valueArray[8]",
    "scoreRight" => "$valueArray[9]",
    "playerNamesLeft" => "$valueArray[10]",
    "playerNamesRight" => "$valueArray[11]"
];

// Write the JSON data to the file
fwrite(fopen("json/overlay.json", "w"), json_encode($dataArray, JSON_PRETTY_PRINT));
