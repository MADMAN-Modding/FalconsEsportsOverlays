<!DOCTYPE html>
<html>

<head>
    <!-- <meta http-equiv="refresh" content="3"> -->
    <title>Player Info</title>
</head>

<body>
    <!-- Just basic radio buttons -->
    <form method="post" action="ssbuPlayerData.php">
        <input type="radio" id="stringInput" name="playerNameLeft" value="Mason D">Mason D
        <input type="radio" id="stringInput" name="playerNameLeft" value="James T">James T
        <input type="submit" value="Submit">
    </form>

    <?php
    class jsonData
    {
        // Makes the variable
        public String $playerName;

        // Function for taking input and setting to the playerName value __contruct runs something on class call btw
        function __construct($playerNameGiven)
        {
            $this->playerName = $playerNameGiven;
        }

        // This takes the name given by the buttons and gives the data for the name given
        function getPlayerInfo()
        {
            // Decodes the json data
            $jsonData = json_decode(file_get_contents("players.json"), true);

            foreach ($jsonData as $jsonData => $playerListValues) {
                foreach ($playerListValues as $playerData => $playerDataValues) {
                    if ($playerDataValues["niceName"] == $this->playerName) {
                        return $playerDataValues;
                    }
                }
            }
        }
    }

    // Tells the class what playerNameGiven should be equal to
    $niceName = new jsonData($_POST["playerNameLeft"]);

    // Sets the value of playerInfo
    $playerInfo = $niceName->getPlayerInfo();

    // Outputs the player data
    echo "<h1 class=\"playerLeft\">$playerInfo[gamerTag] | $playerInfo[niceName] | $playerInfo[main]";

    $jsonData = [
        [
            "id" => "287947",
            "title" => "Shazam!",
            "poster" => "https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg",
            "overview" => "A boy is given the ability to become an adult superhero in times of need with a single magic word.",
            "release_date" => "1553299200",
            "genres"=> ["Action", "Comedy", "Fantasy"]
        ],
        [
            "id" => "299537",
            "title" => "Captain Marvel",
            "poster" => "https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
            "overview" => "The story follows Carol Danvers as she becomes one of the universe’s most powerful heroes when Earth is caught in the middle of a galactic war between two alien races. Set in the 1990s, Captain Marvel is an all-new adventure from a previously unseen period in the history of the Marvel Cinematic Universe.",
            "release_date" => "1551830400",
            "genres"=> ["Action", "Adventure", "Science Fiction"]
        ]
    ];

    $jsonString = json_encode($jsonData, JSON_PRETTY_PRINT);

    $fp = fopen("test.json", "c+");

    fwrite($fp, $jsonString);
    fclose($fp);

    ?>

</body>



<style>
    body {
        width: 100vw;
        height: 100vh;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: fixed;
        /* background-image: url("images/VS\ Screen/vsScreen.png"); */
        overflow-y: hidden;
        overflow-x: hidden;
    }

    .data {
        color: white;
        text-align: center;
        font: bolder;
        z-index: 1000;
        display: inline;
    }

    h1 {
        font-size: 70px;
    }

    h2 {
        font-size: 50px;
    }

    .playerLeft {
        text-align: center;
    }
</style>

</html>