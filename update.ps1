Read-Host "Press enter to begin the download"

Start-BitsTransfer -Source "https://raw.githubusercontent.com/HeinzEric/FalconsEsportsOverlays/main/download.ps1" -Destination "C:\Users\$env:UserName\Documents\Overlay\download.ps1"