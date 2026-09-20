$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$source = Read-Host 'Paste the folder containing your portfolio MP4 files'
if (-not (Test-Path $source)) { throw "Folder not found: $source" }
$files = Get-ChildItem -Path $source -Recurse -File -Filter *.mp4
if (-not $files) { throw 'No MP4 files found.' }
$mediaText = Get-Content (Join-Path $root 'src/media.ts') -Raw
foreach ($match in [regex]::Matches($mediaText, 'project:"([^"]+)"[^\n]+source:"([^"]+\.mp4)"')) {
  $brand = $match.Groups[1].Value
  $name = $match.Groups[2].Value
  $slug = ($brand.ToLower() -replace '[^a-z0-9]+','-').Trim('-')
  $dest = Join-Path $root ("public/media/VIDEO/" + $slug)
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  $found = $files | Where-Object { $_.Name -eq $name } | Select-Object -First 1
  if ($found) { Copy-Item $found.FullName (Join-Path $dest $name) -Force; Write-Host "Synced $brand / $name" }
}
Write-Host 'Video sync complete.'
