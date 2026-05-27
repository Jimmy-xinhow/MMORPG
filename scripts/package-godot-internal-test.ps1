$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceProject = Join-Path $repoRoot "godot-client"
$sourceGodot = Join-Path $repoRoot "tools\godot-4.6.3"
$apiBase = if ($env:GODOT_API_BASE) { $env:GODOT_API_BASE } else { "https://lucky-pack-api-production.up.railway.app" }

$destRoot = Join-Path $repoRoot "build\internal-test"
$destProject = Join-Path $destRoot "godot-client"
$destGodot = Join-Path $destRoot "godot-4.6.3"
$destGodotExe = Join-Path $destGodot "Godot_v4.6.3-stable_win64.exe"

if (!(Test-Path $sourceProject)) {
  throw "Godot project not found: $sourceProject"
}

if (!(Test-Path $sourceGodot)) {
  throw "Godot executable folder not found: $sourceGodot"
}

$resolvedRepo = [System.IO.Path]::GetFullPath($repoRoot)
$resolvedDest = [System.IO.Path]::GetFullPath($destRoot)
if (!$resolvedDest.StartsWith($resolvedRepo, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to package outside the repo: $resolvedDest"
}

if (Test-Path $destRoot) {
  Remove-Item -LiteralPath $destRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $destProject | Out-Null
New-Item -ItemType Directory -Force -Path $destGodot | Out-Null

Copy-Item -Path (Join-Path $sourceProject "project.godot") -Destination $destProject -Force
Copy-Item -Path (Join-Path $sourceProject "README.md") -Destination $destProject -Force
Copy-Item -Path (Join-Path $sourceProject "assets") -Destination $destProject -Recurse -Force
Copy-Item -Path (Join-Path $sourceProject "scenes") -Destination $destProject -Recurse -Force
Copy-Item -Path (Join-Path $sourceProject "scripts") -Destination $destProject -Recurse -Force
Copy-Item -Path (Join-Path $sourceGodot "*") -Destination $destGodot -Recurse -Force

$launcherPs1 = @"
`$ErrorActionPreference = "Stop"
`$root = Split-Path -Parent `$MyInvocation.MyCommand.Path
`$godot = Join-Path `$root "godot-4.6.3\Godot_v4.6.3-stable_win64.exe"
`$project = Join-Path `$root "godot-client"
Start-Process -FilePath `$godot -ArgumentList @(
  "--path",
  `$project,
  "--rendering-driver",
  "opengl3",
  "--resolution",
  "432x768",
  "--windowed",
  "--",
  "--api-base=$apiBase"
) -WorkingDirectory `$project
"@

$launcherCmd = @"
@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Play-Brave-Legend-Online.ps1"
"@

$readme = @"
# 勇者傳說 Brave Legend Internal Test

Run `Play-Brave-Legend-Online.cmd` to open the Godot client.

Backend API:
$apiBase

This package is for small internal playtesting. It uses the Godot engine client and the deployed player-safe API. External payment is not wired; the current payment loop uses the simulated approval state `SIMULATED_APPROVED`.
"@

Set-Content -Path (Join-Path $destRoot "Play-Brave-Legend-Online.ps1") -Value $launcherPs1 -Encoding UTF8
Set-Content -Path (Join-Path $destRoot "Play-Brave-Legend-Online.cmd") -Value $launcherCmd -Encoding ASCII
Set-Content -Path (Join-Path $destRoot "README-INTERNAL-TEST.md") -Value $readme -Encoding UTF8

Write-Output "Packaged Godot internal test client:"
Write-Output $destRoot
