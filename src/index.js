'use strict';

const { app, BrowserWindow, Menu} = require('electron');
const path = require('path');
var knex = require('knex')({client: 'sqlite3', connection: {filename: "src/datos/msnMessenger.db"}});
let mainWindow;

const electron = require('electron'),
ipcMain = electron.ipcMain;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => 
{
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
	webPreferences: {
    nodeIntegration: true
	}
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'views/search/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  
  //{ menu personalizado

  var menu = Menu.buildFromTemplate([
      {
          label: 'Menu',
          submenu: [
              {label:'Customer Information',
				  click() {
					  console.log("Customer List");
				  },
				  //accelerator: 'F5'
			  },
              {label:'Garments list',
				  click() {
					  console.log("Garments List");
				  },
				  //accelerator: 'F3'
			  },
              {label:'Exit',
				  click() {
					  app.quit();
				  }
			  }
          ]
      }
  ]);
  Menu.setApplicationMenu(menu);
  //}
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/*
 * Código personalizado  
*/

//{  Código de la ventana principal de la aplicación 

//}

//{  codigo de la página principal de clientes

ipcMain.on("customersIndexWindowLoaded", function()
{
	let resultado = knex.raw('SELECT customer_list.customerID, customer_list.lastName, customer_list.firstName, membership_catalogue.membershipName, customer_list.membershipBalance FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.deleted = 0');
	resultado.then(function(rows)
  	{
		mainWindow.webContents.send("consultaListaUsuarios", rows);
	}).catch(function(error) 
	{
    	console.error(error);
  	});
}
);

// Búsqueda de clientes
ipcMain.on("searchClientName", (event, customerName) => 
{
	let resultado = knex.raw("SELECT customer_list.customerID, customer_list.lastName, customer_list.firstName, membership_catalogue.membershipName, customer_list.membershipBalance FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.lastName LIKE ? OR customer_list.firstName LIKE ? AND customer_list.deleted = 0", [customerName[0], customerName[1]]);
	
	console.log(resultado.toSQL());
	
	resultado.then((rows) => 
	{
		mainWindow.webContents.send("resultadosBusquedaClientes", rows);
	}).catch((error) => 
	{
		console.error(error);
	});
});

//}

//{  Código de la ventana para dar de alta un cliente
ipcMain.on("createUserWindowLoaded", function()
{
	let resultado = knex.select("membershipID", "membershipName", "membershipBenefits").from("membership_catalogue").where("deleted", 0);
  	resultado.then(function(rows){mainWindow.webContents.send("catalogoMembresias", rows);}).catch(function(error){console.error(error);});
}
);

ipcMain.on("checkCurrentPrimaryKeyIndex", function()
{
  let resultado = knex.select("seq").from("sqlite_sequence").where("name", "customer_list");
  resultado.then(function(rows){mainWindow.webContents.send("currentPrimaryKeyIndexChecked", rows);}).catch(function(error) {
    console.error(error);
  });
}
);

ipcMain.on("customerInformation", function(event, informacion)
{
	let today = new Date();
	let d = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();

	let insercion = knex("customer_list").insert({customerID: informacion[0], lastName: informacion[1][0], firstName: informacion[1][1], gender: informacion[2], phoneNumber: informacion[4], customerAddress: informacion[3], dateJoined: d.toString(), membershipType: parseInt(informacion[5]), membershipBalance: parseInt(informacion[6]), clientRemarks: informacion[7], deleted: informacion[8]}).then(mainWindow.webContents.send("customerSucessfullyCreated")).catch((err) => { console.log( err); throw err });

});
//}

//{ código de la ventana para ver el perfil del cliente/editar información del cliente

ipcMain.on("getCustomerInformation", (evt, customerID) => 
{
	let resultado = knex.raw("SELECT customer_list.customerID, customer_list.lastName, customer_list.firstName, customer_list.gender, customer_list.phoneNumber, customer_list.customerAddress, customer_list.dateJoined, membership_catalogue.membershipName, customer_list.membershipBalance, customer_list.clientRemarks FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.customerID = ? AND customer_list.deleted = 0", [customerID]);
	resultado.then((rows) => 
	{
		mainWindow.webContents.send("informacionClienteRecibida", rows);
	}
	).catch((error) => 
	{
		console.error(error);
	});
});

// Enviar la informacion para editar al cliente (la consulta debe casi exatamente igual a obtener la información)
ipcMain.on("editUserWindowLoaded", (evt, customerID) => 
{
	let resultado = knex.raw("SELECT customer_list.lastName, customer_list.firstName, customer_list.gender, customer_list.phoneNumber, customer_list.customerAddress, customer_list.dateJoined, membership_catalogue.membershipName, customer_list.membershipBalance, customer_list.clientRemarks FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.customerID = ? AND customer_list.deleted = 0", [customerID]);

	resultado.then((rows) => 
	{
		mainWindow.webContents.send("informacionClienteRecibida", rows);
	}
	).catch((error) => 
	{
		console.error(error)
	}
	);
});

// Actualizar la informacion del cliente

ipcMain.on("updateCustomerInformation", function(event, informacion)
{
	let today = new Date();
	let d = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();

	let insercion = knex.raw("UPDATE customer_list SET lastName = ?, firstName = ?, gender = ?, phoneNumber = ?, customerAddress = ?, clientRemarks = ? WHERE customerID = ? AND deleted = 0", [informacion[0][0], informacion[0][1], informacion[1], informacion[3], informacion[2], informacion[4], parseInt(informacion[5])]);
	
	insercion.then(mainWindow.webContents.send("customerSucessfullyUpdated")).catch((err) => { console.log( err); throw err });

});

//}


