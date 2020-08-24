'use strict';

let ipcCustomerIndex = require('electron').ipcRenderer;
let comboboxMembresias = document.getElementById("membershipSelector");
let beneficiosMembresia = [];
let botonEnviarFormulario = document.getElementById("sendDataButton");
let llavePrimaria = 0;

document.addEventListener("DOMContentLoaded", () =>
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

        ipcCustomerIndex.send("checkCurrentPrimaryKeyIndex");
        ipcCustomerIndex.on("currentPrimaryKeyIndexChecked", function(evt, result)
            {            
                if(result.length == 0)
                {
                    llavePrimaria = 1;
                    return;
                }
                llavePrimaria = result[0].seq;     
            }
        );
    }
);

// Muestra al usuario el beneficio obtenido por cada tipo de membresia.

comboboxMembresias.onchange = () => {
    let infoMembresias = document.getElementById("benefitsShow");
    infoMembresias.setAttribute("value", beneficiosMembresia[(comboboxMembresias.options[comboboxMembresias.selectedIndex].value) - 1]);
}

// Guardar en la base de datos. Primero valida el formulario y después ejecuta la consulta. Si hay algún error con la validación, se notifica al usuario y se aborta la operación. Posterior a esto, se procede a guardar en la BBDD

botonEnviarFormulario.addEventListener('click', () => {

    //#region Variables necesarias para la operación
    let nombreCliente = document.getElementById("inputCustomerName");
    let radioClientes = document.querySelector("input[name='tratamientoCliente']:checked").value
    let direccionCliente = document.getElementById("customerAddress");
    let telefonoCliente = document.getElementById("customerPhone"); 
    let alertasValidacion = document.getElementById("validationWarnings");
    //#endregion

    //#region Validación del nombre del cliente. Si no se provee de un nombre de cliente, se notifica al usuario y se suspende la operación.
    if(!nombreCliente.value)
    {
        alertasValidacion.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Holy guacamole!</strong> Please write a name to continue. <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        return;
    }
    //#endregion

    //#region Guardar datos
    /*
    Componentes del arreglo:
        [0] llave primaria de la tabla
        [1] Arreglo con nombre y apellidos
        [2] Tratamiento
        [3] Dirección del cliente
        [4] Teléfono del cliente
        [5] Llave foranea de la membresía asignada
        [6] Dinero electrónico asignado por la membresía
        [7] Eliminado o no eliminado (al mometo de crear, siempre debe ser cero)
    */
    let informacion = [llavePrimaria, dividir_nombre(nombreCliente.value), radioClientes, direccionCliente.value, telefonoCliente.value, comboboxMembresias.options[comboboxMembresias.selectedIndex].value, beneficiosMembresia[(comboboxMembresias.options[comboboxMembresias.selectedIndex].value) - 1], 0];
    ipcCustomerIndex.send("customerInformation", informacion);
    ipcCustomerIndex.on("customerSucessfullyCreated", () => {
        $("#modalDBSuccess").modal("show");
    })

    console.log(informacion);
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