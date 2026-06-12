Set-Location "C:\Users\luuhu\OneDrive\Desktop\Project\Landing Page coffe\apps\admin-mobile"
$env:PATH = "C:\Users\luuhu\AppData\Local\flutter\flutter\bin;$env:PATH"
flutter pub get
if ($LASTEXITCODE -ne 0) { Write-Host "FAIL: pub get" -ForegroundColor Red; exit 1 }
flutter build apk --debug
if ($LASTEXITCODE -ne 0) { Write-Host "FAIL: build apk" -ForegroundColor Red; exit 1 }
Write-Host "SUCCESS: build\app\outputs\flutter-apk\app-debug.apk" -ForegroundColor Green
