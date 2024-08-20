@echo off
echo Starting Discord Bot Bank...

:: Check if Node.js is installed
node -v >nul 2>&1
IF ERRORLEVEL 1 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b
)

:: Start the bot
node index.js

IF ERRORLEVEL 1 (
    echo Failed to start the bot. Please check your setup and try again.
    pause
    exit /b
)

echo Bot stopped.
pause