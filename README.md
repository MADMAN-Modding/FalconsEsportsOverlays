# FalconsEsportsOverlays
 A stream overlay for multiple games with a control page and a overlay page, both interact with a json file. Writen with PHP, JS, and AJAX
<h1>Setup</h1>

<h2>Docker</h2>
<h3>Get the docker <a href="https://hub.docker.com/repository/docker/madmanmodding/falconsesportsoverlay/general" target="_blank">here</a></h3>
<p>I (MADMAN-Modding) usually update the docker every release, but it will still pull from main everytime it starts</p>
<h1>Clone/update with git cli</h1>
<h1>PHP Setup</h1>
<h2>Windows</h2>
<h4>PHP</h4>

<p>Installing PHP is a bit of an inaccuracy, on Windows all you have to do is <a href="https://windows.php.net/download#php-8.3">download it</a>. I recommend getting the .zip of the non thread safe. Once downloaded, extract the .zip file by right-clicking and press extract all. Now you can move this to whatever folder you want, or not, it doesn't matter.</p>

<h3>Adding PHP to the PATH (optional but recommended)</h3>

<p>Open the system enviornment variables by typing environmental into the Windows searchbar and pressing enter, it should open the correct menu.</p>

![An image of searching for enviornmental variables settings](https://github.com/MADMAN-Modding/PHP-Web-EmulatorJS/blob/main/README%20Stuff/environmentalVariables_Step1.png)

<p>Now click on the "Environmental Variables" button in the bottom right of the menu.</p>

![Environmental variables step2](https://github.com/MADMAN-Modding/PHP-Web-EmulatorJS/blob/main/README%20Stuff/environmentalVariables_Step2.png)

<p>We're almost done with this part, now select PATH and press edit</p>

![An image opening the environmental variables configuration](https://github.com/MADMAN-Modding/PHP-Web-EmulatorJS/blob/main/README%20Stuff/environmentalVariables_Step3.png)

<p>Now just press new and type the path of the folder you are keeping the php files, if there are space than surround the path with quotes.</p>

![A image of adding a environmental variable](https://github.com/MADMAN-Modding/PHP-Web-EmulatorJS/blob/main/README%20Stuff/environmentalVariables_Step4.png)

<p>Now you should be all set to continue on with setup.</p>

<h4>Git (optional but recommended)</h4>

<p>Installing git makes it easier to update the clonned code when the project it updated. Download git from <a href="https://git-scm.com/download/win">here</a>. Get the version for your machine, most likely it will be 64-bit. Run the .exe and just go through the menus, the default options will be fine for this.</p>

<h3>Cloning the Repository (only with git)</h3>

<p>Open up Powershell and cd to where you will be storing the project.</p>

    cd "C:\Path\to\your\data"

<p>Run the following command to clone the repository</p>

    git clone https://github.com/HeinzEric/FalconsEsportsOverlays.git

<p>This will clone the repository to the folder you are in.</p>

<h3>Getting the code without git installed</h3>

<p>Go to the <a href="https://github.com/HeinzEric/FalconsEsportsOverlays">main page of the project</a>. Press the code button above and to the right of the files displayed, then press download zip. Just extract that folder to the folder you will be keeping the project.</p>

<h3>Running the PHP server</h3>

<p>Open up Powershell or CMD, I personally use Powershell because I prefer it, cd into the directory that holds the code, cd to where you are storing the project.</p>

    cd "C:\Path\to\your\data"

<p>Before starting the server get your ip so other devices can use the website</p>

    ipconfig

<p>Look for the line that says ipv4 and copy the ip from there, if it doesn't look the example I supplied that's ok. In this test virtual machine the ip I would use is 10.0.0.120</p>

![Ipconfig output image](https://github.com/MADMAN-Modding/PHP-Web-EmulatorJS/blob/main/README%20Stuff/ipconfig.png)

<p>If you have added php to the PATH run the first command, if you chose to not add PHP to the PATH than run the second command. (You can replace the ip-address with localhost if you choose but it will only work on that machine)</p>

    php -S ip-address:8080

    ..\path\php.exe -S ip-address:8080

<p>You can now put the ip-address:8080 into the url bar of your browser and you will be able to see the website.</p>
