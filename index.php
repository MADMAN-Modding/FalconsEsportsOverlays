<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DCScoreboardOverlay</title>

    <!-- These will be echoed by php, but yeah this should work hopefully -->
    <!-- <h2 id="leftNumber">1</h2>
    <h2 id="rightNumber">2</h2> -->

    <?php
        $csv = array();

        if(($handle = fopen("data.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $csv[] = $data;
            }
        }

        fclose($handle);


        // This is for if there were multiple rows
        // for ($i = 1; $i < count($csv); $i++) {
            for ($ii = 0; $ii < count($csv[1])-1; $ii++) {
                echo "<h1 class=" . $csv[0][$ii] . ">" . $csv[1][$ii] . "</h1>";
            }
        // }

        // All of these read the overlay and use a different image for the middle depending on what it is, none of these are case sensitive
        // If no correct arguement is found, it will default to the DC logo

        // For the DC logo use DC
        if (strtoupper($csv[1][4]) == "DC") {
            echo '<img id="logo" src="images/Logo.png">';
        } 
        
        // For SSBU use SSBU or Super Smash Bros. Ultimate
        elseif (strtoupper($csv[1][4]) == "SSBU" || strtolower($csv[1][4]) == "super smash bros. ultimate") {
            echo '<img id="logo" src="images/SSBU.png">';
        } 
        
        // For Rocket League use RL or Rocket League
        elseif (strtoupper($csv[1][4]) == "RL" || strtolower($csv[1][4]) == "rocket league") {
            echo '<img id="logo" src="images/rocketLeague.png">';
        }

        // For Splatoon use SPLAT or Splatoon
        elseif (strtoupper($csv[1][4]) == "SPLAT" || strtolower($csv[1][4]) == "splatoon") {
            echo '<img id="logo" src="images/Splatoon.png">';
        }

        else {
            echo '<img id="logo" class="fallback" src="images/Logo.png">';
        }

        // Checks the left for won or lost status
        if(strtolower($csv[2][0]) == "won" || strtolower($csv[2][0]) == "win") {
            echo '<img class="wonLeft" src="images/[W].png">';
        }   elseif(strtolower($csv[2][0]) == "lost" || strtolower($csv[2][0]) == "lose") {
            echo '<img class="lostLeft" src="images/[L].png">';
        }

        // Checks the right for won or lost status
        if(strtolower($csv[2][1]) == "won" || strtolower($csv[2][1]) == "win") {
            echo '<img class="wonRight" src="images/[W].png">';
        }   elseif(strtolower($csv[2][1]) == "lost" || strtolower($csv[2][1]) == "lose") {
            echo '<img class="lostRight" src="images/[L].png">';
        }
    ?>

    <style>
        body {
            background-color: antiquewhite;
            max-width: 1920px;
        }

        #logo {
            position: absolute;
            top: 5px;
            left: 890px;
            width: 10%;

        }

        .score1 {
            position:absolute;
            top:55px;
            left:397px;
            width: 50px;
            height: 50px;
            z-index: 1000;
        }


        .score2  {
            position:absolute;
            z-index: 1000;
            top:55px;
            right:367.5px;
            width: 50px;
            height: 50px;
        }
           
        .teamName1  {
            position:absolute;
            z-index: 1000;
            top:55px;
            left:467.5px;
            height: 50px;
            color: white;
        }

        .teamName2  {
            position:absolute;
            z-index: 1000;
            top:55px;
            right:507.5px;
            height: 50px;
            color: white;
        }
        
        .wonLeft, .lostLeft {
            position: absolute;
            z-index: 1000;
            left: 670px;
            top: 130px;
        }
        
        .wonRight, .lostRight {
            position: absolute;
            z-index: 1000;
            right: 670px;
            top: 130px;
        }

    </style>
    <!--1920x1080-->
</head>

<body>
    <img src="images/scoreboardNew.png">
    <div id="leftScore"></div>
    <div id="rightScore"></div>
   
</body>

</html>
