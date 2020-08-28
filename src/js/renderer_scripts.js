'use strict';

const { ipcMain } = require('electron');

var ipcRenderer = require('electron').ipcRenderer;

document.addEventListener("keydown", (e) => 
{	
	if(e.key === 'F8')
		window.location.href = "search/index.html";
});