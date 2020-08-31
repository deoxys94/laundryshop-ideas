'use strict';

let ipcCustomerIndex = require('electron').ipcRenderer;
let botonEnviarFormulario = document.getElementById("sendDataButton");
let botonRegresarPantalla = document.getElementById("returnButton");
let botonIrLista = document.getElementById("goToListButton");

let nombreCliente = document.getElementById("inputCustomerName");
let radioClientes;
let direccionCliente = document.getElementById("customerAddress");
let telefonoCliente = document.getElementById("customerPhone"); 
let alertasValidacion = document.getElementById("validationWarnings");
let observacionesCliente = document.getElementById("customerNotesField");
let botonActualizarClientes = document.getElementById("updateDataButton");

document.addEventListener("DOMContentLoaded", () =>
{
	let auxURL = new URL(document.URL);
	let auxArgs = new URLSearchParams(auxURL.search);
	let nombreMembresia = document.getElementById("staticMembershpType");
	let saldoPuntos = document.getElementById("staticBalanceInfo");
	
	ipcCustomerIndex.send("editUserWindowLoaded", auxArgs.get("customerID"));
	ipcCustomerIndex.on("informacionClienteRecibida", (evt, infoCliente) => 
	{
		nombreCliente.value = infoCliente[0].lastName.toString() + infoCliente[0].firstName.toString();
		direccionCliente.value = infoCliente[0].customerAddress.toString();
		telefonoCliente.value = infoCliente[0].phoneNumber.toString();
		saldoPuntos.value = infoCliente[0].membershipBalance.toString();
		nombreMembresia.value = infoCliente[0].membershipName.toString();
		observacionesCliente.value = infoCliente[0].clientRemarks.toString();
		selectRadioGender(infoCliente[0].gender.toString());
	});
	
}
);

botonActualizarClientes.addEventListener("click", () => 
{
	let auxURL = new URL(document.URL);
	let auxArgs = new URLSearchParams(auxURL.search);
	
	let alertasValidacion = document.getElementById("validationWarnings");
	radioClientes = document.querySelector("input[name='tratamientoCliente']:checked").value;
	
    if(!nombreCliente.value)
    {
		alertasValidacion.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Holy guacamole!</strong> Please write a name to continue. <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
		return;
    }
	
	/*
	Componentes del arreglo:
        [0] Arreglo con nombre y apellidos
        [1] Tratamiento
        [2] Dirección del cliente
        [3] Teléfono del cliente
        [4] Las observaciones/notas sobre el cliente
		[5] La llave primaria (Customer ID)
    */

	console.log(auxArgs.get("customerID"));
	console.log(typeof auxArgs.get("customerID"));

    let informacion = [dividir_nombre(nombreCliente.value), radioClientes, direccionCliente.value, telefonoCliente.value, observacionesCliente.value, auxArgs.get("customerID")];
	
    ipcCustomerIndex.send("updateCustomerInformation", informacion);
	
    ipcCustomerIndex.on("customerSucessfullyUpdated", () => 
    {
        $("#modalDBSuccess").modal("show");
    });
	
});

function dividir_nombre(stringNombre = "stri")
{
    let apellido = "";
    let nombre = "";
    stringNombre = stringNombre.replace(/\s/g,'');

    if(stringNombre.length == 2)
    {
        apellido = stringNombre.charAt(0);
        nombre = stringNombre.charAt(1);
        return [apellido, nombre];
    }

    if(stringNombre.length == 3)
    {
        apellido = stringNombre.charAt(0);
        nombre = stringNombre.charAt(1) + stringNombre.charAt(2);

        return [apellido, nombre];
    }

    if(stringNombre.length > 3)
    {
        apellido = stringNombre.charAt(0) + stringNombre.charAt(1);
        nombre = stringNombre.charAt(2) + stringNombre.charAt(3);
        return [apellido, nombre];
    }
}


function selectRadioGender(stringGender)
{
	if(stringGender == "小姐")
	{
		radioClientes = document.getElementById("tratamientoCliente1");
		radioClientes.checked = true;
		return;
	}
	
	if(stringGender == "先生")
	{
		radioClientes = document.getElementById("tratamientoCliente2");
		radioClientes.checked = true;
		return;
	}

	if(stringGender == "-")
	{
		radioClientes = document.getElementById("tratamientoCliente3");
		radioClientes.checked = true;
		return;
	}
}


botonRegresarPantalla.addEventListener("click", () => 
{
	window.history.back();
});

botonIrLista.addEventListener("click", () => 
{
	window.location.href = "index.html";
});
