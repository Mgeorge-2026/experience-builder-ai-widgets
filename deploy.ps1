param (
[string]$City = "billerica"
)
​$DownloadsPath = "$env:USERPROFILE\Downloads"
$RepoPath = "C:\Users\jcucino\Git\experience-builder-ai-widgets$City"
$GitRoot = "C:\Users\jcucino\Git\experience-builder-ai-widgets"
​Write-Host "Finding the newest zip in Downloads..." -ForegroundColor Cyan
LatestZip = Get-ChildItem -PathDownloadsPath -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
​if (-not $LatestZip) {
Write-Host "Error: No zip files found in Downloads folder." -ForegroundColor Red
exit
}
​Write-Host "Extracting $(LatestZip.Name) toRepoPath..." -ForegroundColor Cyan
Expand-Archive -Path LatestZip.FullName -DestinationPathRepoPath -Force
​Write-Host "Committing and pushing to GitHub..." -ForegroundColor Cyan
Set-Location $GitRoot
git add .
git commit -m "Automated widget update for $City"
git push origin main
​Write-Host "Deployment to $City complete!" -ForegroundColor Green

