'use strict';

let ipcTopUp = require('electron').ipcRenderer;
let comboboxMembresias = document.getElementById("membershipSelector");
let botonRegresar = document.getElementById("botonRegresarAnterior");
let botonActualizarInfo = document.getElementById("sendDataButton");
let botonExitoModal = document.getElementById("buttonCloseModal");
let catalogoMembresias;

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
	
    ipcTopUp.send("getTopUpInformation", auxArgs.get("customerID"));
    ipcTopUp.on("catalogoMembresias", (evt, resultadosMembresia) => 
	{
		catalogoMembresias = resultadosMembresia;
		catalogoMembresias[0].membershipType = "Select Membership";
	});

    ipcTopUp.on("informacionRecargaRecibida", (evt, results) => 
	{
		document.getElementById("pageHeader").innerHTML = `
		<h2>Recharge</h2>
		<h3>${results[0].customerName.toString()}</h3>`;
		
		for(let i = 0; i < catalogoMembresias.length; i++)
			document.getElementById("membershipSelector").innerHTML += '<option value="'+ catalogoMembresias[i].membershipID.toString() +'">'+ catalogoMembresias[i].membershipName.toString() +'</option>';
			
        document.getElementById("customerIDShow").value = results[0].customerID.toString();
		document.getElementById("balanceShow").value = results[0].membershipBalance.toString();
		document.getElementById("newBalanceShow").value = results[0].membershipBalance.toString();
	});
    
    botonActualizarInfo.disabled = true;
});

comboboxMembresias.onchange = () => 
{
    botonActualizarInfo.disabled = false;
    
    if(comboboxMembresias.options[comboboxMembresias.selectedIndex].value == 1)
        botonActualizarInfo.disabled = true;
    
	document.getElementById("benefitsShow").value = catalogoMembresias[(comboboxMembresias.options[comboboxMembresias.selectedIndex].value) - 1].membershipBenefits.toString();
	
	document.getElementById("newBalanceShow").value = (parseInt(document.getElementById("balanceShow").value) + parseInt(document.getElementById("benefitsShow").value));
}

botonActualizarInfo.addEventListener("click", () =>
{
    let informacion = [parseInt(comboboxMembresias.options[comboboxMembresias.selectedIndex].value), parseInt(document.getElementById("newBalanceShow").value), parseInt(document.getElementById("customerIDShow").value)];
    
    ipcTopUp.send("topUpClient", informacion);
    
    ipcTopUp.on("topUpSucessful", () => 
    {
        document.getElementById("modalTitle").innerHTML = "Success!";
        document.getElementById("messageBox").innerHTML = "Customer data successfully updated!!";
        document.getElementById("buttonReturnClientList").style.visibility = "hidden";
        document.getElementById("buttonContinueEditing").style.visibility = "hidden";
        document.getElementById("modalVariosUsos").classList.add("is-active");        
    }
    );

});

botonExitoModal.addEventListener("click", () =>  
{
	window.location.href = "index.html";
}
);

botonRegresar.addEventListener("click", () => 
{
	window.history.back();
})
