Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot ".."))
$env:DATA_FILE = "data\dev-store.json"
& "C:\Program Files\nodejs\node.exe" "src\server.js"
