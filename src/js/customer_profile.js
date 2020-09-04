'use strict';

let ipcCustomerProfile = require('electron').ipcRenderer;
let goBackNavBarButton = document.getElementById("botonRegresarAnterior");
let deleteUserNavbarButton = document.getElementById("deleteUserButton");
let dontDeleteUserButton = document.getElementById("buttonGoBack");

document.addEventListener("DOMContentLoaded", () =>
{
    let auxURL = new URL(document.URL);
    let auxArgs = new URLSearchParams(auxURL.search);
    let htmlPerfil = document.getElementById("profileInformation");

    if(!auxArgs.get("customerID"))
    {
        htmlPerfil.innerHTML = `
			<article class="message is-link">
				<div class="message-header">
					<p>System error</p>
				</div>
				<div class="message-body">
					Something went wrong. Please go back and try again.
				</div>
			</article>
		`;
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
				<div class="tile is-4 is-vertical is-parent">
					<div class="tile is-child box">
					<p class="title">${results[0].customerName.toString()}</p>
					<p class="title">${results[0].gender.toString()}</p>
					</div>
					<div class="tile is-child box">
					<p><strong>Client Number</strong></p>
					<p>${results[0].customerID.toString()}</p>
					<p><strong>Client since</strong></p>
					<p>${results[0].dateJoined.toString()}</p>
					</div>
				</div>
				<div class="tile is-parent">
					<div class="tile is-child box">
					<p><strong>Address</strong></p>
					<p>${results[0].customerAddress.toString()}</p>
					<p><strong>Phone number</strong></p>
					<p>${results[0].phoneNumber.toString()}</p>
					<p><strong>Membership Type</strong></p>
					<p>${results[0].membershipName.toString()}</p>
					<p><strong>Membership balance</strong></p>
					<p>${results[0].membershipBalance.toString()}</p>
					<p><strong>Remarks</strong></p>
					<p>${results[0].clientRemarks.toString()}</p>
					</div>
				</div>`;
	
		document.getElementById("editCustomerButton").setAttribute("href", `editCustomer.html?customerID=${results[0].customerID.toString()}`);
		document.getElementById("topUpNavbar").setAttribute("href", `topUp.html?customerID=${results[0].customerID.toString()}`);
    });
}
);

goBackNavBarButton.addEventListener("click", () => 
{
	window.history.back();
}
);

deleteUserNavbarButton.addEventListener("click", () => 
{
	document.getElementById("modalDeleteUser").classList.add("is-active");
}
);

dontDeleteUserButton.addEventListener("click", () =>
{
	document.getElementById("modalDeleteUser").classList.remove("is-active");
});