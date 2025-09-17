# PowerShell script to rename bingo audio files to the correct format
# From: public_audio_adam-voice_B-1.mp3
# To:   bingo-1.mp3

Write-Host "Renaming bingo audio files to correct format..."

# Get all MP3 files in the numbers directory
$files = Get-ChildItem -Path "public\audio\numbers" -Filter "*.mp3"

foreach ($file in $files) {
    $oldName = $file.Name
    $newName = ""
    
    # Extract the number from the filename
    if ($oldName -match "B-(\d+)") {
        $number = $matches[1]
        $newName = "bingo-$number.mp3"
    }
    elseif ($oldName -match "I-(\d+)") {
        $number = $matches[1]
        $newName = "bingo-$number.mp3"
    }
    elseif ($oldName -match "N-(\d+)") {
        $number = $matches[1]
        $newName = "bingo-$number.mp3"
    }
    elseif ($oldName -match "G-(\d+)") {
        $number = $matches[1]
        $newName = "bingo-$number.mp3"
    }
    elseif ($oldName -match "O-(\d+)") {
        $number = $matches[1]
        $newName = "bingo-$number.mp3"
    }
    
    if ($newName -ne "") {
        $oldPath = $file.FullName
        $newPath = Join-Path $file.Directory $newName
        
        Write-Host "Renaming: $oldName -> $newName"
        Rename-Item -Path $oldPath -NewName $newName
    }
}

Write-Host "Renaming complete!"
Write-Host "Verifying files..."

# List the renamed files
Get-ChildItem -Path "public\audio\numbers" -Filter "bingo-*.mp3" | Sort-Object Name | ForEach-Object {
    Write-Host "✓ $($_.Name)"
}
