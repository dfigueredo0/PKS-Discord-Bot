$directories = @("C:\Users\Dylan\pro_Repos\PKSDiscordBot", "C:\Users\Dylan\repos\DougBot")

foreach ($directory in $directories) {
    Set-Location -Path $directory

    Start-Process powershell -ArgumentList "-NoExit", "-Command nodemon" -WindowStyle Hidden
}