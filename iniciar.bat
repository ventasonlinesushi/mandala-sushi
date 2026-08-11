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

echo Iniciando servidores...

REM 1. Servidor web
start "Mandala Web" cmd /c "python -m http.server 3000"

REM 2. Servidor de impresion
start "Mandala Print" cmd /c "cd /d %~dp0receptor && python print_server.py"

REM 3. Receptor de pedidos online
start "Mandala Receiver" cmd /c "cd /d %~dp0receptor && python ordereceiver.py --marca mandala"

echo.
echo Todos los servicios iniciados.
echo Presiona cualquier tecla para DETENER TODO...
pause >nul

echo Deteniendo servicios...
taskkill /F /FI "WINDOWTITLE eq Mandala*" /T 2>nul
echo Servicios detenidos.
pause
