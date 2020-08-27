'use strict';

let ipcCustomerIndex = require('electron').ipcRenderer;
let botonEnviarFormulario = document.getElementById("sendDataButton");

document.addEventListener("DOMContentLoaded", () =>
    {
        ipcCustomerIndex.send("editUserWindowLoaded");
		ipcCustomerIndex.on("informacionClienteRecibida", (evt, infoCliente) => 
		{
			console.log(infoCliente);
		});
		
    }
);