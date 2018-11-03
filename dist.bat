@echo off

if not exist dist\ (
	mkdir dist\
)
if not exist dist\img\ (
	mkdir dist\img\
)
if not exist dist\Sortable.min.js (
	copy \y Sortable.min.js dist\Sortable.min.js
)
if not exist dist\img\favicon.ico (
	copy \y img\favicon.ico dist\img\favicon.ico
)
if not exist dist\img\favicon.ico (
	copy \y img\channel.jpg dist\img\channel.jpg
)

tsc & node compile.js