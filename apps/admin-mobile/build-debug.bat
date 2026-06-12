@echo off
cd /d "%~dp0"
echo ========================================
echo  Build Debug APK - Admin Mobile
echo ========================================
echo.

echo [1/2] Getting dependencies...
call flutter pub get
if errorlevel 1 (
    echo FAIL: flutter pub get
    pause
    exit /b 1
)

echo.
echo [2/2] Building debug APK...
call flutter build apk --debug
if errorlevel 1 (
    echo FAIL: flutter build apk
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS! APK at: build\app\outputs\flutter-apk\app-debug.apk
echo ========================================
pause
