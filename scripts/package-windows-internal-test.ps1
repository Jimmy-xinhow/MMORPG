$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$buildDir = Join-Path $repoRoot "build\windows"
$exe = Join-Path $buildDir "BraveLegend.exe"
$apiBase = if ($env:GODOT_API_BASE) { $env:GODOT_API_BASE } else { "https://lucky-pack-api-production.up.railway.app" }

if (!(Test-Path $exe)) {
  throw "Windows export not found. Run the Godot Windows export first: $exe"
}

$launcherCmd = @"
@echo off
cd /d "%~dp0"
start "" "BraveLegend.exe" --rendering-driver opengl3 --resolution 432x768 --windowed -- --api-base=$apiBase
"@

$readme = @"
# 勇者傳說 Brave Legend Windows Internal Test

Run `Play-Brave-Legend-Online.cmd`.

Backend API:
$apiBase

This build is a Godot Windows export. The player client connects to the deployed player-safe API and does not expose operator settlement or withdrawal workflows.
"@

Set-Content -Path (Join-Path $buildDir "Play-Brave-Legend-Online.cmd") -Value $launcherCmd -Encoding ASCII
Set-Content -Path (Join-Path $buildDir "README-INTERNAL-TEST.md") -Value $readme -Encoding UTF8

Write-Output "Prepared Windows internal test build:"
Write-Output $buildDir
