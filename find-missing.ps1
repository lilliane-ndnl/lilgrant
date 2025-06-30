# Load summary data
Write-Host "Loading summary data..."
$summary = Get-Content "public/data/summary.json" | ConvertFrom-Json
Write-Host "Summary entries: $($summary.Count)"

# Get detail file slugs
Write-Host "Getting detail files..."
$detailFiles = Get-ChildItem "public/data/details" -Name
$detailSlugs = @{}
foreach ($file in $detailFiles) {
    $slug = $file.Replace('.json', '')
    $detailSlugs[$slug] = $true
}
Write-Host "Detail files: $($detailFiles.Count)"

# Find missing schools
Write-Host "Finding missing schools..."
$missing = @()
foreach ($school in $summary) {
    if (-not $detailSlugs.ContainsKey($school.slug)) {
        $missing += $school
    }
}

Write-Host "`nResults:"
Write-Host "Summary entries: $($summary.Count)"
Write-Host "Detail files: $($detailFiles.Count)"
Write-Host "Missing: $($missing.Count)"

if ($missing.Count -gt 0) {
    Write-Host "`nMissing Schools:"
    for ($i = 0; $i -lt [Math]::Min(20, $missing.Count); $i++) {
        $school = $missing[$i]
        Write-Host "$($i+1). $($school.name) ($($school.city), $($school.state)) - ID: $($school.id) - Slug: $($school.slug)"
    }
    
    if ($missing.Count -gt 20) {
        Write-Host "... and $($missing.Count - 20) more"
    }
    
    # Save to file
    $missing | ConvertTo-Json | Out-File "missing-schools.json" -Encoding UTF8
    Write-Host "`nSaved missing schools to missing-schools.json"
} else {
    Write-Host "`nNo missing schools found!"
} 