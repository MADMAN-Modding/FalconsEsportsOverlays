<!DOCTYPE html>

<!-- Data Checking PHP -->
<?php

// Opens the json file
$jsonData = json_decode(file_get_contents("json/overlay.json"), true);

// Values to retrieve from the JSON
$valueArrayNames = array("teamNameLeft", "teamNameRight", "scoreLeft", "scoreRight", "teamColorRight", "overlay");

for ($i = 0; $i < count($valueArrayNames); $i++) {
    if (isset($_GET["$valueArrayNames[$i]"])) {
        $valueArray[$i] = $_GET["$valueArrayNames[$i]"];
    } else {
        $valueArray[$i] = $jsonData[$valueArrayNames[$i]];
    }
}

// Sets the values to equal the respective array value
$teamNameLeft = $valueArray[0];
$teamNameRight = $valueArray[1];
$scoreLeft = $valueArray[2];
$scoreRight = $valueArray[3];
$teamColorRight = $valueArray[4];
$overlay = $valueArray[5];

// Array for json
$dataArray = [
    "teamNameLeft" => "$teamNameLeft",
    "teamNameRight" => "$teamNameRight",
    "scoreLeft" => "$scoreLeft",
    "scoreRight" => "$scoreRight",
    "overlay" => "$overlay",
    "teamColorRight" => "$teamColorRight"
];

// Encode the JSON data
$jsonDataEncoded = json_encode($dataArray, JSON_PRETTY_PRINT);

// Open the JSON file for writing
$jsonOpener = fopen("json/overlay.json", "w");

// Write the JSON data to the file
fwrite($jsonOpener, $jsonDataEncoded);

// Close the file
fclose($jsonOpener);
?>