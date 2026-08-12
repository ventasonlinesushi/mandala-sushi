@echo off
title Mandala Sushi - Sistema de Pedidos
cd /d "%~dp0"

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr "192.168 10."') do set IP=%%a
set IP=%IP: =%
if "%IP%"=="" set IP=192.168.1.194

cls
echo.
echo   ==========================================
echo      MANDALA SUSHI CAUCEL
echo      Sistema de Pedidos y POS
echo   ==========================================
echo.
echo     PANEL ADMIN (computadora):
echo     http://localhost:3000/admin/
echo.
echo     MESERO / CAJERA (celular/tablet):
echo     http://%IP%:3000/admin/
echo.
echo     COCINA (KDS):
echo     http://%IP%:3000/admin/cocina.html
echo.
echo   ==========================================
echo     NO CIERRES ESTA VENTANA
echo   ==========================================
echo.

:loop
echo [%time%] Verificando servicios...

REM 1. Servidor web (puerto 3000)
netstat -ano | findstr ":3000.*LISTENING" >nul
if errorlevel 1 (
    echo [!] Servidor web CAIDO - reiniciando...
    start "Mandala Web" cmd /c "python -m http.server 3000"
) else (
    echo [OK] Servidor web (3000)
)

REM 2. Servidor de impresion (puerto 5100)
netstat -ano | findstr ":5100.*LISTENING" >nul
if errorlevel 1 (
    echo [!] Servidor de impresion CAIDO - reiniciando...
    start "Mandala Print" cmd /c "cd /d %~dp0receptor && python print_server.py"
) else (
    echo [OK] Servidor de impresion (5100)
)

REM 3. Receptor de pedidos online
tasklist /FI "WINDOWTITLE eq Mandala Receiver*" 2>nul | findstr "cmd.exe" >nul
if errorlevel 1 (
    echo [!] Receptor de pedidos CAIDO - reiniciando...
    start "Mandala Receiver" cmd /c "cd /d %~dp0receptor && python ordereceiver.py --marca mandala"
) else (
    echo [OK] Receptor de pedidos online
)

echo [%time%] Todos los servicios OK. Proxima verificacion en 15s...
timeout /t 15 /nobreak >nul
goto loop
