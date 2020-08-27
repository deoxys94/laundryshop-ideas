'use strict';

let ipcCustomerProfile = require('electron').ipcRenderer;
let goBackNavBarButton = document.getElementById("botonRegresarAnterior");

document.addEventListener("DOMContentLoaded", () =>
{
    let auxURL = new URL(document.URL);
    let auxArgs = new URLSearchParams(auxURL.search);
    let htmlPerfil = document.getElementById("contenidoPrincipal");

    if(!auxArgs.get("customerID"))
    {
        htmlPerfil.innerHTML = `
        <div class="alert alert-warning" role="alert">
            <strong>Holy guacamole!</strong> Something went wrong. Go back and try it again.
            <button type="button" class="btn btn-outline-dark" id="goBackAlertButton">
                <span>Go back</span>
            </button>
        </div>`;
        return;
    }

    ipcCustomerProfile.send("getCustomerInformation", auxArgs.get("customerID"));
    ipcCustomerProfile.on("informacionClienteRecibida", (evt, results) => 
    {
        if(results.length == 0)
        {
            htmlPerfil.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <strong>Holy guacamole!</strong> Something went wrong. Go back and try it again.
                <button type="button" class="btn btn-outline-dark" id="goBackAlertButton">
                    <span>Go back</span>
                </button>
            </div>`;
            return;
        }

        htmlPerfil.innerHTML = `
        <h2>${results[0].lastName.toString()}${results[0].firstName.toString()} - ${results[0].gender.toString()}</h2>
        
        <ul class="list-group list-group-horizontal-xl">
            <li class="list-group-item list-group-item-light flex-fill"><strong>Member since</strong> ${results[0].dateJoined.toString()}</li>
            <li class="list-group-item list-group-item-light flex-fill"><strong>Client number:</strong> ${results[0].customerID.toString()}</li>
        </ul>

        <ul class="list-group">
            <li class="list-group-item list-group-item-info">Address</li>
            <li class="list-group-item">${results[0].customerAddress.toString()}</li>
            <li class="list-group-item list-group-item-info">Phone Number</li>
            <li class="list-group-item">${results[0].phoneNumber.toString()}</li>
            <li class="list-group-item list-group-item-info">Membership type</li>
            <li class="list-group-item">${results[0].membershipName.toString()}</li>
            <li class="list-group-item list-group-item-info">Remaining balance</li>
            <li class="list-group-item">${results[0].membershipBalance.toString()}</li>
            <li class="list-group-item list-group-item-info">Customer's remarks</li>
            <li class="list-group-item">${results[0].clientRemarks.toString()}</li>
        </ul><br>
    `;
    });
});