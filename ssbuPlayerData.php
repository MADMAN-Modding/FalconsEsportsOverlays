<!DOCTYPE html>
<html>

<head>
    <!-- <meta http-equiv="refresh" content="3"> -->
    <title>Player Info</title>
</head>

<body>
    <form method="post" action="ssbuPlayerData.php">
        <input type="radio" id="stringInput" name="playerNameLeft" value="Mason D">Mason D
        <input type="radio" id="stringInput" name="playerNameLeft" value="James T">James T
        <input type="submit" value="Submit">
    </form>

    <?php
    class jsonData
    {

        public String $playerName;


        function __construct($playerNameGiven)
        {
            $this->playerName = $playerNameGiven;
        }

        function getPlayerInfo()
        {
            $jsonDataEncoded = file_get_contents("data.json");

            $jsonData = json_decode($jsonDataEncoded, true);

            foreach ($jsonData as $jsonData => $playerListValues) {
                foreach ($playerListValues as $playerData => $playerDataValues) {
                    if ($playerDataValues["niceName"] == $this->playerName) {
                        return $playerDataValues;
                    }
                }
            }
        }
    }

    $niceName = new jsonData($_POST["playerNameLeft"]);

    $playerInfo = $niceName->getPlayerInfo();

    echo "<h1 class=\"playerLeft\">$playerInfo[gamerTag] | $playerInfo[niceName] | $playerInfo[main]";

    // echo $playerInfo["masonD"];

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