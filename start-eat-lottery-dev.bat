@echo off
setlocal

REM Change working directory to the folder where this script resides
cd /d "%~dp0"

echo =============================================
echo   吃饭盲盒 - 开发服务器启动中...
echo   若浏览器未自动打开，访问： http://localhost:5173/
echo =============================================

REM Start Vite dev server and open browser
npm run dev -- --open

endlocal
