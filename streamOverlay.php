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
            for ($ii = 0; $ii <=count($csv[1]); $ii++) {
                echo "<h1 class=" . $csv[0][$ii] . ">" . $csv[1][$ii] . "</h1>";
                
            }
        // }

    ?>

    <style>
        body {
            background-color: antiquewhite;

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
            width: 50px;
            height: 50px;
            color: white;
        }

        .teamName2  {
            position:absolute;
            z-index: 1000;
            top:55px;
            right:507.5px;
            width: 50px;
            height: 50px;
            color: white;
        }
        

    </style>
    <!--1920x1080-->
</head>

<body>
    <img src="Overlay/scoreboardNew.png">
    <img id="logo" src="Overlay/Logo.png">
    <div id="leftScore"></div>
    <div id="rightScore"></div>
   
</body>

</html>