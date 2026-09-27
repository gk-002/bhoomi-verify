@echo off
echo ===================================================
echo   BhoomiVerify - Quick GitHub Repository Uploader
echo ===================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo Error: No repository URL provided.
    pause
    exit /b 1
)

echo.
echo [1/4] Initializing Git repository...
git init

echo [2/4] Staging files (using .gitignore)...
git add .

echo [3/4] Creating commit...
git commit -m "feat: BhoomiVerify SIH 2026 Production Release"

echo [4/4] Pushing to GitHub...
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ===================================================
echo   Upload complete! Your repository is now live on GitHub!
echo ===================================================
pause
