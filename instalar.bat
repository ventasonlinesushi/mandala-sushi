@echo off
title INSTALADOR - Sistema de Pedidos
cd /d "%~dp0"
cls
echo.
echo   ==========================================
echo      INSTALACION AUTOMATICA
echo   ==========================================
echo.

REM 1. Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo   Python no encontrado. Instalando Python oficial...
    winget install --id Python.Python.3.13 --exact --scope user --accept-package-agreements --accept-source-agreements
    set "PATH=%LocalAppData%\Programs\Python\Python313;%LocalAppData%\Programs\Python\Python313\Scripts;%PATH%"
    python --version >nul 2>&1
    if errorlevel 1 (
        echo   [ERROR] Reinicia Windows y vuelve a ejecutar instalar.bat.
        pause
        exit /b
    )
)
echo   [OK] Python detectado

REM 2. Instalar dependencias
echo   Instalando dependencias...
python -m pip install --upgrade pywin32
echo   [OK] Dependencias listas

REM 3. La impresora se elige desde Admin - Configurar impresoras

REM 4. Obtener IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr "192.168 10."') do set IP=%%a
set IP=%IP: =%
if "%IP%"=="" set IP=192.168.1.194

REM 5. Puerto fijo
set PUERTO=3000

cls
echo.
echo   ==========================================
echo      SISTEMA INICIADO
echo   ==========================================
echo.
echo     Panel admin (esta PC):
echo     http://localhost:%PUERTO%/admin/
echo.
echo     Celular / Tablet (mismo WiFi):
echo     http://%IP%:%PUERTO%/admin/
echo.
echo     Cocina:
echo     http://%IP%:%PUERTO%/admin/cocina.html
echo.
echo   ==========================================
echo     NO CIERRES ESTA VENTANA
echo   ==========================================
echo.

REM 6. Iniciar servidores
start "Web Server" cmd /c "python -m http.server %PUERTO%"
start "Print Server" cmd /c "cd /d %~dp0receptor && python print_server.py"
start "Receiver" cmd /c "cd /d %~dp0receptor && python ordereceiver.py --marca mandala"
timeout /t 3 /nobreak >nul
start "" "http://localhost:%PUERTO%/admin/"
echo   En el panel usa: Configurar impresoras
echo.
echo   Servidores activos. Presiona para detener...
pause >nul
taskkill /F /FI "WINDOWTITLE eq Web*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Print*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Receiver*" /T 2>nul
