$path = "C:\Users\$env:UserName\Documents\Overlay\"

$gitInstalled = Read-Host "Do you have git installed? [Y/N]";

if ($gitInstalled.ToLower() -eq "y") {
    git.exe clone https://github.com/HeinzEric/FalconsEsportsOverlays.git $path;
} else {
    $gitDownload = Read-Host "Download and install git? [Y/N]";

    if ($gitDownload.ToLower() -eq "y") {

        Start-Process "https://git-scm.com/download/win"

        Write-Host "Download git for your respective version, then run the installer, the default options for git who work for this just fine";

        # Removes the directory incase something is there already
        Remove-Item $path -r -force;

        # Waits for user input
        Read-Host "Press enter when git is installed";

        # Clones the repo
        git.exe clone https://github.com/HeinzEric/FalconsEsportsOverlays.git $path;
    } elseif ($gitDownload.ToLower() -eq "n") {
        
        # Removes the directory incase something is there already
        Remove-Item $path -r -force;

        # Creates the directory
        mkdir $path;

        # Downloads the latest release
        Start-BitsTransfer -Source "https://github.com/HeinzEric/FalconsEsportsOverlays/releases/download/Release/FalconsEsportsOverlays-main.zip" -Destination "$path\main.zip";

        # Cds to the correct one
        Set-Location $path;
        
        # Extracts the file
        Expand-Archive -LiteralPath $path\main.zip -DestinationPath $path;

        # Moves files to the root
        Move-Item -Path $path\FalconsEsportsOverlays-main\* -Destination $path;
        
        # Removes the old directory
        Remove-Item FalconsEsportsOverlays-main;

        # REMOVE BEFORE PUSH
        Set-Location D:\Coding\Web\FalconsEsportsOverlays;
    }
}



# Start-BitsTransfer -Source "https://codeload.github.com/HeinzEric/FalconsEsportsOverlays/zip/refs/heads/main" -Destination "C:\Users\$env:UserName\Documents\Overlay\main.zip"