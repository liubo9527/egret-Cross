@echo off
set INSTALL=C:\Users\Administrator\AppData\Roaming\Egret\engine\3.2.6\
set PATH=tools\commands\
 
echo copy: crossdomain.js
copy crossdomain.js "%INSTALL%%PATH%crossdomain.js"

echo copy: mergeJS.js
copy mergeJS.js "%INSTALL%%PATH%mergeJS.js"

echo copy: resGroup.js
copy resGroup.js "%INSTALL%%PATH%resGroup.js"

pause


