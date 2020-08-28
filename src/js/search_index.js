'use strict';

let cajaBusqueda = document.getElementById("searchBox");
let ipcCustomerIndex = require('electron').ipcRenderer;

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
		if(document.getElementById("radioName").checked)
		{
			ipcCustomerIndex.send("searchClientName", dividir_nombre(document.getElementById("searchBox").value.toString()));
		}
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
					<td>${result[i].lastName.toString()}${result[i].firstName.toString()}</td>
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
	}
	);
}
);

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