@echo off
cd /d "%~dp0"
node --version >nul 2>&1
if errorlevel 1 (
  echo Install Node.js 24 or newer, then run this file again.
  pause
  exit /b 1
)
if not exist "node_modules\stripe\package.json" (
  echo Run npm ci in this folder once to install the Stripe SDK, then try again.
  pause
  exit /b 1
)
echo Open http://127.0.0.1:3000/portal.html after the server starts.
echo Keep this window open while reviewing the campus.
node server/app.js
pause
