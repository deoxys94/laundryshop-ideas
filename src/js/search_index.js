'use strict';

let ipcCustomerIndex = require('electron').ipcRenderer;
let goBackNavBarButton = document.getElementById("botonRegresarAnterior");
let cajaBusqueda = document.getElementById("searchBox");
let botonBuscar = document.getElementById("buttonSearch");
let primerPanel = document.getElementById("customerSearchOption1");
let segundoPanel = document.getElementById("customerSearchOption2");
let tercerPanel = document.getElementById("customerSearchOption3");
let cuartoPanel = document.getElementById("customerSearchOption4");

document.addEventListener("DOMContentLoaded", () => 
{
	document.getElementById("tabCustomers").classList.add("is-active");
	document.getElementById("buttonSearch").classList.add("is-link");
	document.getElementById("buttonSearch").innerHTML = "Search Customers";
	
});

document.addEventListener("keydown", (e) => 
{	
	if(e.key === 'F1')
		document.getElementById("radioName").checked = true;
		
	if(e.key === 'F2')	
		document.getElementById("radioNumber").checked = true;

	if(e.key === 'F3')
		document.getElementById("radioPhone").checked = true;
		
	if(e.key === 'F4')
		document.getElementById("radioNotes").checked = true;
		
	if(e.key === 'Escape')
		window.location.href = "../index.html";
});

cajaBusqueda.addEventListener("keydown", (e) =>
{
	if(e.key === 'Enter')
	{
		buscarElementos();
	}
}
);

botonBuscar.addEventListener("click", () =>
{
	buscarElementos();
});

primerPanel.addEventListener("click", () =>
{
	document.getElementById("radioName").checked = true;
});

segundoPanel.addEventListener("click", () =>
{
	document.getElementById("radioNumber").checked = true;
});

tercerPanel.addEventListener("click", () =>
{
	document.getElementById("radioPhone").checked = true;
});

cuartoPanel.addEventListener("click", () =>
{
	document.getElementById("radioNotes").checked = true;
});

goBackNavBarButton.addEventListener("click", () => 
{
	window.history.back();
});

function buscarElementos()
{
	if(!cajaBusqueda.value)
	{
		document.getElementById("searchResults").innerHTML = `
			<div class="notification is-danger is-light">
				<strong>Empty searchbox</strong>. Please write something to begin.
			</div>
		`;
		return;
	}
	
	if(!document.querySelector("input[name='customerSearchValue']:checked"))
	{
		document.getElementById("searchResults").innerHTML = `
			<div class="notification is-warning is-light">
				Please select a search category
			</div>
		`;
	}
	
	if(document.getElementById("radioName").checked)
	{
		ipcCustomerIndex.send("searchClientName", dividir_nombre(document.getElementById("searchBox").value.toString()));
	}
	
	if(document.getElementById("radioNumber").checked)
	{
		ipcCustomerIndex.send("searchClientNumber", parseInt(document.getElementById("searchBox").value.toString()));
	}
	
	if(document.getElementById("radioPhone").checked)
	{
		ipcCustomerIndex.send("searchClientPhone", "%" + document.getElementById("searchBox").value.toString() + "%");
	}
	
	if(document.getElementById("radioNotes").checked)
	{
		ipcCustomerIndex.send("searchClientRemarks", "%" + document.getElementById("searchBox").value.toString() + "%");
	}
	
	ipcCustomerIndex.on("resultadosBusquedaClientes", (evt, result) => 
	{
		let contenidos;

		if (result.length == 0)
		{
			document.getElementById("searchResults").innerHTML = `
				<div class="notification is-link is-light">
					<strong>No customers found</strong>. Please try again with different keywords.
				</div>
			`;
			return;
		}
		else
		{
			contenidos = `
			<h5>Search results</h5>
			<table class="table is-fullwidth is-hoverable">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Name</th>
						<th scope="col">Membership</th>
						<th scope="col">Balance</th>
						<th scope="col">Actions</th>
					</tr>
				</thead>
			<tbody>
			`;    

			for(var i = 0; i < result.length; i++)
			{
				contenidos += `
				<tr>
					<th scope="row">${result[i].customerID.toString()}</th>
					<td>${result[i].customerName.toString()}</td>
					<td>${result[i].membershipName.toString()}</td>
					<td>${result[i].membershipBalance.toString()}</td>
					<td><a class="button is-link" href="../customers/customerProfile.html?customerID=${result[i].customerID.toString()}" role="button">Customer Info.</a></td>
				</tr>`;
			}
			
			contenidos += `
				</tbody>
			</table>`;
			
			document.getElementById("searchResults").innerHTML = contenidos;
		}

	});
}

function dividir_nombre(stringNombre = "stri")
{
    let apellido = "";
    let nombre = "";
    stringNombre = stringNombre.replace(/\s/g,'');

	if(stringNombre.length == 1)
	{
		apellido = stringNombre.charAt(0);
		nombre = stringNombre.charAt(0);
		return ["%" + apellido + "%", "%" + nombre + "%"];
	}

    if(stringNombre.length == 2)
    {
        apellido = stringNombre.charAt(0);
        nombre = stringNombre.charAt(1);
        return ["%" + apellido + "%", "%" + nombre + "%"];
    }

    if(stringNombre.length == 3)
    {
        apellido = stringNombre.charAt(0);
        nombre = stringNombre.charAt(1) + stringNombre.charAt(2);

        return ["%" + apellido + "%", "%" + nombre + "%"];
    }

    if(stringNombre.length > 3)
    {
        apellido = stringNombre.charAt(0) + stringNombre.charAt(1);
        nombre = stringNombre.charAt(2) + stringNombre.charAt(3);
        return ["%" + apellido + "%", "%" + nombre + "%"];
    }
}