'use strict';

let ipcCustomerIndex = require('electron').ipcRenderer;
let botonBusquedaClientes = document.getElementById("customerSearchButton");
let botonNavbar = document.getElementById("navbarExpandButton");

document.addEventListener("DOMContentLoaded", () =>
    {
        let htmlLista = document.getElementById("pageContent");

        // Crear la lista de usuarios registrados
        ipcCustomerIndex.send("customersIndexWindowLoaded");
        ipcCustomerIndex.on("consultaListaUsuarios", function(evt, result)
            {
                let contenidos;

                if (result.length == 0)
                {
						htmlLista.innerHTML = `
						<article class="message is-link">
							<div class="message-header">
								<p>No customers</p>
							</div>
							<div class="message-body">
								No customers Found. Use the buttons above to begin.
							</div>
						</article>
					`;
                    return;
                }
                
                contenidos = `
				<h2>Customer list</h2>
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
						<td><a class="button is-link" href="customerProfile.html?customerID=${result[i].customerID.toString()}" role="button">Customer Info.</a></td>
					</tr>`;
                }
                
                contenidos += `
                    </tbody>
                </table>`;

                htmlLista.innerHTML += contenidos;
            }
        );
    }
);

botonNavbar.addEventListener("click", () => 
{
	if(botonNavbar.classList.contains("is-active"))
	{
		botonNavbar.classList.remove("is-active");
		document.getElementById("navbarMenu").classList.remove("is-active");
		return;
	}
	
	botonNavbar.classList.add("is-active");
	document.getElementById("navbarMenu").classList.add("is-active");
});

function dividir_nombre(stringNombre = "stri")
{
    let apellido = "";
    let nombre = "";
    stringNombre = stringNombre.replace(/\s/g,'');

	if(stringNombre.length == 1)
	{
		apellido = stringNombre.charAt(0);
		nombre = stringNombre.charAt(0);
		return [apellido, nombre];
	}

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