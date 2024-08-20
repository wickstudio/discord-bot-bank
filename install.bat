@echo off
echo Installing Discord Bot Bank dependencies...

:: Check if Node.js is installed
node -v >nul 2>&1
IF ERRORLEVEL 1 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b
)

:: Install the dependencies using npm
npm install

IF ERRORLEVEL 1 (
    echo Failed to install dependencies. Please check your npm setup and try again.
    pause
    exit /b
)

echo Dependencies installed successfully.
pause