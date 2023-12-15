<html>
    <head>
    <!--Bootstrap5-->
        <!-- Latest compiled and minified CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">

        <!-- Latest compiled JavaScript -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script> 
    </head>
    <body>
        <form method="post" >
        <center>
            <div class="row">
                <div class="col-4">
                    <input type="submit" style="background-image: url('images/SSBU.png'); border:none; background-repeat:no-repeat;background-size:100% 100%; width: 300px; height: 300px; background-color: transparent; color: transparent;"" name="SSBU" value="SSBU"/>
                </div>
                <div class="col-4">
                    <input type="submit" style="background-image: url('images/Splatoon.png'); border:none; background-repeat:no-repeat;background-size:100% 100%; width: 300px; height: 300px; background-color: transparent; color: transparent;"" name="Splat" value="Splat"/>
                </div>
                <div class="col-4">
                    <input type="submit" name="RL" class="button" value="Rocket League" style="background-image: url('images/rocketLeague.png'); border:none; background-repeat:no-repeat;background-size:100% 100%; width: 300px; height: 300px; background-color: transparent; color: transparent;"/> 
                </div>
                
            </div>
        </center>

        <center>
            <div class="row">
                <div class="col-6">
                    <input type="submit" style="background-image: url('images/Valorant.png'); border:none; background-repeat:no-repeat;background-size:100% 100%; width: 300px; height: 300px; background-color: transparent; color: transparent;"" name="Valorant" value="Valorant"/>
                </div>
                <div class="col-6">
                    <input type="submit" style="background-image: url('images/Logo.png'); border:none; background-repeat:no-repeat;background-size:100% 100%; width: 300px; height: 300px; background-color: transparent; color: transparent;"" name="DC" value="DC"/>
                </div>
                <input class="quantity" id="id_form-0-quantity" min="0" name="form-0-quantity" value="1" type="number" style="width: 50px;">
            </div>
        </center>
    </form>

    <style>
        body {
            max-width: 1920px;
            margin-left: auto;
            margin-right: auto;
        }
    </style>

    </body>
</html>

<?php
    if(isset($_POST['SSBU'])) { 
        $overlay = "ssbu";
    } 
    if(isset($_POST['Splat'])) { 
        $overlay = "splat";
    }
    if(isset($_POST['RL'])) { 
        $overlay = "rl";
    }
    if(isset($_POST['Valorant'])) { 
        $overlay = "val";
    }     
    if(isset($_POST['DC'])) { 
        $overlay = "dc";
    } 

    // CSV Values
    $teamName1 = "Divine Child";
    $teamName2 = "Catholic Central";
    $score1 = "10";
    $score2 = "2";
    $winLost1 = "win";
    $winLost2 = "lost";

    $dataArray = array(
        array("teamName1", "teamName2", "score1", "score2", "overlay"),
        array($teamName1, $teamName2, $score1, $score2, $overlay),
        array($winLost1, $winLost2)
    );

    // Opens the csv
    $csvFile = fopen("data.csv", "c+");

    foreach ($dataArray as $line) {
        fputcsv($csvFile, $line);
    }
?>