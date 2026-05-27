$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceProject = Join-Path $repoRoot "godot-client"
$sourceGodot = Join-Path $repoRoot "tools\godot-4.6.3"
$runRoot = "C:\tmp\lucky-pack-godot-run"
$runProject = Join-Path $runRoot "godot-client"
$runGodot = Join-Path $runRoot "godot-4.6.3\Godot_v4.6.3-stable_win64.exe"

if (!(Test-Path $sourceGodot)) {
  throw "Godot executable not found. Expected: $sourceGodot"
}

New-Item -ItemType Directory -Force -Path $runRoot | Out-Null
New-Item -ItemType Directory -Force -Path $runProject | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $runRoot "godot-4.6.3") | Out-Null
Copy-Item -Path (Join-Path $sourceProject "*") -Destination $runProject -Recurse -Force
Copy-Item -Path (Join-Path $sourceGodot "*") -Destination (Join-Path $runRoot "godot-4.6.3") -Recurse -Force

$argsList = @(
  "--path",
  $runProject,
  "--rendering-driver",
  "opengl3",
  "--resolution",
  "432x768",
  "--windowed"
)

if ($env:GODOT_API_BASE) {
  $argsList += @("--", "--api-base=$env:GODOT_API_BASE")
}

Start-Process -FilePath $runGodot -ArgumentList $argsList -WorkingDirectory $runProject
