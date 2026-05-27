@echo off
cd /d "%~dp0.."
set DATA_FILE=data\dev-store.json
"C:\Program Files\nodejs\node.exe" src\server.js >> tmp\server.out 2>> tmp\server.err
