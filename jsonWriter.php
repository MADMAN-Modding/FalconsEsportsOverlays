<?php

// Opens the json file
$jsonData = json_decode(file_get_contents("json/overlay.json"), true);

// Values to retrieve from the JSON
$valueArrayNames = array("teamNameLeft", "teamNameRight", "winsLeft", "winsRight", "teamColorRight", "overlay", "week", "scoreLeft", "scoreRight", "playerNamesLeft", "playerNamesRight", "schoolNameLeft", "schoolNameRight");

for ($i = 0; $i < count($valueArrayNames); $i++) {
    if (isset($_GET["$valueArrayNames[$i]"])) {
        $valueArray[$i] = $_GET["$valueArrayNames[$i]"];
    } else {
        $valueArray[$i] = $jsonData[$valueArrayNames[$i]];
    }
}

// Sets the values to equal the respective array value


// String replacement because a # can't be sent using xml
$valueArray[4] = str_replace("!", "#", $valueArray[4]);

// Array for json
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
    "playerNamesRight" => "$valueArray[10]",
    "schoolNameLeft" => "$valueArray[11]",
    "schoolNameRight" => "$valueArray[12]"
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
</body>