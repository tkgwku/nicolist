@echo off

if not exist dist\ (
	mkdir dist\
)
if not exist dist\img\ (
	mkdir dist\img\
)
if not exist dist\js\ (
	mkdir dist\js\
)
if not exist dist\js\Sortable.min.js (
	copy /y js\Sortable.min.js dist\js\Sortable.min.js
)
if not exist dist\img\favicon.ico (
	copy /y img\favicon.ico dist\img\favicon.ico
)
if not exist dist\img\favicon.ico (
	copy /y img\channel.jpg dist\img\channel.jpg
)

echo "Started to compile TS"

tsc & node compile.js