@echo off
echo Starting Viya App Development Environment...

:: Kill any existing Node.js processes
taskkill /F /IM node.exe 2>nul

:: Start Backend
start cmd /k "cd Backend && echo Starting Backend... && npm start"

:: Wait for 5 seconds to let backend initialize
timeout /t 5 /nobreak

:: Start Frontend
start cmd /k "cd Frontend && echo Starting Frontend... && npm start"

echo Development servers are starting...
echo Backend will be available at http://localhost:5000
echo Frontend will be available at http://localhost:3000
