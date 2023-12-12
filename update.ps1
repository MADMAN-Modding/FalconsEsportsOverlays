Read-Host "Press enter to begin the download"

Remove-Item "C:\Users\$env:UserName\Downloads\download.ps1"

Start-BitsTransfer -Source "https://raw.githubusercontent.com/HeinzEric/FalconsEsportsOverlays/main/download.ps1" -Destination "C:\Users\$env:UserName\Downloads\download.ps1"

Set-Location "C:\Users\$env:UserName\Downloads\"

.\download.ps1