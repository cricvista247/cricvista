$oldEmail = "sportpredict247@gmail.com"
$newEmail = "cricvista247@gmail.com"
$extensions = @("*.ts", "*.tsx", "*.js", "*.json", "*.env", "*.md", "*.txt", "*.yaml", "*.yml")

Get-ChildItem -Recurse -Include $extensions | Where-Object {
    $_.FullName -notmatch "node_modules|\.next|\.git"
} | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8
    if ($content -match [regex]::Escape($oldEmail)) {
        $newContent = $content -replace [regex]::Escape($oldEmail), $newEmail
        Set-Content $file $newContent -Encoding UTF8 -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host ""
Write-Host "--- Verification: searching for remaining occurrences ---"
$remaining = Get-ChildItem -Recurse -Include $extensions | Where-Object {
    $_.FullName -notmatch "node_modules|\.next|\.git"
} | Select-String -Pattern [regex]::Escape($oldEmail)

if ($remaining) {
    Write-Host "WARNING: $($remaining.Count) occurrence(s) still found!"
    $remaining | ForEach-Object { Write-Host $_.ToString() }
} else {
    Write-Host "SUCCESS: Zero occurrences of '$oldEmail' remain."
}
