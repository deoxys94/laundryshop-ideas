'use strict';

let ipcSettingsScreen = require('electron').ipcRenderer;

document.addEventListener("DOMContentLoaded", () =>
{
    let auxURL = new URL(document.URL);
    let auxArgs = new URLSearchParams(auxURL.search);

    console.log(auxArgs.get('name1'));
    console.log(auxArgs.get('name2'));
}
);