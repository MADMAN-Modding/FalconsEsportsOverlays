# The variable for where the data will be kept for the overlay
$data = "C:\Users\$env:UserName\Documents\Overlay\"

# The variable where the php server will go
$phpPath = "C:\Users\$env:UserName\Documents\php"

# Asks the user if they've installed git
$gitInstalled = Read-Host "Do you have git installed? [Y/N]";

# Checks the user's resposne
if ($gitInstalled.ToLower() -eq "y") {
    # Removes the directory incase something is there already
    Remove-Item $data -r -force;
    
    git.exe clone "https://github.com/HeinzEric/FalconsEsportsOverlays.git" $data;
} elseif ($gitInstalled.ToLower() -eq "n") {

    # Asks if the user wants to download git
    $gitDownload = Read-Host "Download and install git? [Y/N]";

    # Checks the user's response
    if ($gitDownload.ToLower() -eq "y") {

        # Opens the git download page for windows
        Start-Process "https://git-scm.com/download/win"

        # Just outputs texts
        Write-Host "Download git for your respective version, then run the installer, the default options for git will work for this just fine";

        # Waits for user input
        Read-Host "Press enter when git is installed";

        # Removes the directory incase something is there already
        Remove-Item $data -r -force;

        # Clones the repo
        git.exe clone "https://github.com/HeinzEric/FalconsEsportsOverlays.git" $data;
    } elseif ($gitDownload.ToLower() -eq "n") {
        
        # Waits for user input
        Read-Host "Press enter to download the latest release"

        # Removes the directory incase something is there already
        Remove-Item $data -r -force;

        # Creates the directory
        mkdir $data;

        # Cds to the correct directory
        Set-Location $data;
        
        # Downloads the latest release
        Start-BitsTransfer -Source "https://github.com/HeinzEric/FalconsEsportsOverlays/releases/download/v1.2/FalconsEsportsOverlays-main.zip" -Destination "main.zip";

        # Extracts the file
        Expand-Archive -LiteralPath "$data\main.zip" -DestinationPath $data;

        # Moves files to the root
        Move-Item -Path "$data\FalconsEsportsOverlays-main\*" -Destination $data;
        
        # Removes the old directory
        Remove-Item -r -force "FalconsEsportsOverlays-main";

        # Removes the downloaded zip
        Remove-Item -r -force "main.zip"
    }
}

# Waits for input before continuing the script
Read-Host "Press enter to download php"

# Delets current php stuff if there is any
Remove-Item $phpPath -r -force 

# Makes the php directory
mkdir $phpPath;

# Starts the php download
Start-BitsTransfer -Source "https://windows.php.net/downloads/releases/php-8.3.0-nts-Win32-vs16-x64.zip" -Destination $phpPath

# Sets the location to do the php downloading and extracting
Set-Location $phpPath;

# Extracts PHP
Expand-Archive -LiteralPath "php-8.3.0-nts-Win32-vs16-x64.zip" -DestinationPath ".";

# Removes the downloaded zip
Remove-Item "php-8.3.0-nts-Win32-vs16-x64.zip" -r -force

# Simply waits for any kind of input
Read-Host "Press enter to start the php server on localhost:8080";

# Sets the propper location for the files
Set-Location $data

# Informs the user of how they can run the server in the future
Write-Host "You can always run the server with ease using the run.ps1 file in $data"

# Runs the php server
..\php\php.exe -S localhost:8080