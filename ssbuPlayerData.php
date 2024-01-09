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