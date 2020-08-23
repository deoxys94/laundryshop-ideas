/*
 * Pendiente:
 * - Hacer una sola consulta a la BD para obtener la información del catálogo de membresias.
 * - No depender del pedazo de código que está en el formulario para poder cambiar lo que aparece en el formulario.
 */

let ipcCustomerIndex = require('electron').ipcRenderer;
let comboboxMembresias = document.getElementById("membershipSelector");
let beneficiosMembresia = [];

document.addEventListener("DOMContentLoaded", function()
    {
        ipcCustomerIndex.send("createUserWindowLoaded");
        ipcCustomerIndex.on("catalogoMembresias", function(evt, result)
            {                
                for (var i = 0; i < result.length;i++)
                {
                    comboboxMembresias.innerHTML += '<option value="'+ result[i].membershipID.toString() +'">'+ result[i].membershipName.toString() +'</option>';
                    beneficiosMembresia[i] = result[i].membershipBenefits.toString();
                }
            }
        );
    }
);

function showMembershipBenefits(i)
{
    let infoMembresias = document.getElementById("benefitsShow");
    
    i--;
    
    infoMembresias.setAttribute("value", beneficiosMembresia[i]);
}