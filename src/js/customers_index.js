var ipcCustomerIndex = require('electron').ipcRenderer;

document.addEventListener("DOMContentLoaded", function()
    {
        ipcCustomerIndex.send("customersIndexWindowLoaded");
        ipcCustomerIndex.on("consultaListaUsuarios", function(evt, result)
            {
                let htmlLista = document.getElementById("container");
                
                if (result.length == 0)
                {
                    htmlLista.innerHTML += '<div class="alert alert-info" role="alert">' + 'No customers found. Use the buttons in the navbar to begin' + '</div>';
                }
            }
        );
    }
);
