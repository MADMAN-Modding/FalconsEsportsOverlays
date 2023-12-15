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
                    <input type="submit" style="background-image: url('images/Valorant.png'); border:none; background-repeat:no-repeat;background-size:100% 100%; width: 300px; height: 300px; background-color: transparent; color: transparent;" name="Valorant" value="Valorant"/>
                </div>
                <div class="col-6">
                    <input type="submit" style="background-image: url('images/Logo.png'); border:none; background-repeat:no-repeat;background-size:100% 100%; width: 300px; height: 300px; background-color: transparent; color: transparent;" name="DC" value="DC"/>
                </div>
            </div>
        </center>


    </form>

    <style>
        body {
            margin-top: 10px;
            max-width: 1920px;
            margin-left: auto;
            margin-right: auto;
            overflow-y: scroll;
            overflow-x: hidden;
            background-color: darkgray;
        }
    </style>

    </body>
</html>

<!-- Dynamic Form Creation PHP -->

<?php

    $csvArray = array();

    if(($handle = fopen("data.csv", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            $csvArray[] = $data;
        }
    }
    
    // CSV Values
    $teamName1 = $csvArray[1][0];
    $teamName2 = $csvArray[1][1];
    $score1 = $_POST['score1'];
    $score2 = $_POST['score2'];
    $winLost1 = $csvArray[2][0];
    $winLost2 = $csvArray[2][1];
    $overlay = $csvArray[1][4];

// Left and right score
echo "<center>";
    echo "<h2>Scores</h2>";
    echo "<form method=\"post\" action=\"controls.php\">";
        echo "<input type=\"number\" id=\"numberInput\" name=\"score1\" value=\"" . $score1 . "\" required>";
        echo "<input type=\"number\" id=\"numberInput\" name=\"score2\" value=\"" . $score2 . "\" required>";
        echo "<button type=\"submit\">Submit</button>";
    echo "</form>";
echo "</center>";

?>

<!-- Data Checking PHP -->
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
    if(isset($_POST['score1'])) { 
        $score1 = $_POST['score1'];
    } 

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