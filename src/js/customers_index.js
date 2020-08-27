'use strict';

let ipcCustomerIndex = require('electron').ipcRenderer;
let botonBusquedaClientes = document.getElementById("customerSearchButton");

document.addEventListener("DOMContentLoaded", () =>
    {
        let htmlLista = document.getElementById("container");

        // Crear la lista de usuarios registrados
        ipcCustomerIndex.send("customersIndexWindowLoaded");
        ipcCustomerIndex.on("consultaListaUsuarios", function(evt, result)
            {
                let contenidos;

                if (result.length == 0)
                {
                    htmlLista.innerHTML = '<div class="alert alert-info" role="alert">' + 'No customers found. Use the buttons in the navbar to begin' + '</div>';
                    return;
                }
                
                contenidos = `
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Membership</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Actions</th>
                            <th scope="col"></th>
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
						<td><a class="btn btn-primary" href="customerProfile.html?customerID=${result[i].customerID.toString()}" role="button">Customer Info.</a></td>
						<td><button type="button" class="btn btn-danger">Delete</button></td>
					</tr>`;
                }
                
                contenidos += `
                    </tbody>
                </table>`;

                htmlLista.innerHTML = contenidos;
            }
        );
    }
);

botonBusquedaClientes.addEventListener('click', () => 
{
    let stringNombreCliente = document.getElementById("customerSearchInput");
    let htmlLista = document.getElementById("searchResultsBox");

    //#region Validación del nombre del cliente. Si no se provee de un nombre de cliente, se notifica al usuario y se suspende la operación.
    if(!stringNombreCliente.value)
        return;
    //#endregion


    ipcCustomerIndex.send("searchAClient", dividir_nombre(stringNombreCliente.value.toString()));
    ipcCustomerIndex.on("resultadosBusquedaClientes", (evt, result) => 
    {
        let contenidos;

        if (result.length == 0)
        {
            htmlLista.innerHTML = '<div class="alert alert-info" role="alert">' + 'No customers found. Please search again' + '</div>';
            return;
        }
        else
        {
            contenidos = `
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Membership</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Actions</th>
                        <th scope="col"></th>
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
                    <td><button type="button" class="btn btn-primary">Edit</button></td>
                    <td><button type="button" class="btn btn-danger">Delete</button></td>
                </tr>`;
            }
            
            contenidos += `
                </tbody>
            </table>`;
            
            htmlLista.innerHTML = contenidos;
        }
    });

    $("#modalCustomerSearch").modal("show");
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