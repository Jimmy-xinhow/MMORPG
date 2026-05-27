Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot ".."))

if ([string]::IsNullOrWhiteSpace($env:ADMIN_TOKEN)) {
  throw "ADMIN_TOKEN is required for production mode."
}

if ([string]::IsNullOrWhiteSpace($env:DATA_FILE)) {
  $env:DATA_FILE = "data\production-store.json"
}

$env:ALLOW_DEMO_ROLE = "false"
& "C:\Program Files\nodejs\node.exe" "src\server.js"
