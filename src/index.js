'use strict';

const { app, BrowserWindow, Menu} = require('electron');
const path = require('path');
let knex = require('knex')({client: 'sqlite3', connection: {filename: "src/datos/msnMessenger.db"}});
let mainWindow;
let newWindow = null;
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
    allowRunningInsecureContent: false,
    //contextIsolation: true,
    enableRemoteModule: false,
    nativeWindowOpen: false,
    nodeIntegration: true,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    safeDialogs: true,
    //sandbox: true,
    webSecurity: true,
    webviewTag: false,

    //preload: path.join(__dirname, 'js/preload.js'),
	}
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'views/customers/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  
  //{ menu personalizado

	var menu = Menu.buildFromTemplate([
	{
		label: 'File',
		submenu: 
		[
			{
				label:'Exit', 
				click() 
				{
					app.quit();
				}
			}
		]
	},
	{
		label: "Customers",
		submenu: 
		[
			{
				label: "placeholder"
			}
		],
	},
	{
		label: "Orders",
		submenu: 
		[
			{
				label: "placeholder"
			}
		]
	},
	{
		label: "Garments",
		submenu: 
			[
				{
					label: "placeholder"
				}
			]
	},
	{
		label: "Help",
		submenu: 
		[
			{
				label: "About",
				click()
				{
					openAbout();
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
function openAbout()
{
	if (newWindow) 
	{
		newWindow.focus();
		return;
	}

	newWindow = new BrowserWindow(
	{
		height: 700,
		resizable: false,
		width: 500,
		title: 'About',
		minimizable: false,
		fullscreenable: false
	});
	
	newWindow.removeMenu();

	newWindow.loadFile(path.join(__dirname, 'views/about.html'));

	newWindow.on('closed', function() 
	{
		newWindow = null;
	});
}
//}

//{  codigo de la página principal de clientes

ipcMain.on("customersIndexWindowLoaded", () =>
{
	console.log("hola");
	let resultado = knex("customer_list").select("customer_list.customerID", "customer_list.customerName", "membership_catalogue.membershipName", "customer_list.membershipBalance").join("membership_catalogue", "customer_list.membershipType", "=", "membership_catalogue.membershipID").where("customer_list.deleted", 0);
	
	resultado.then(function(rows)
  	{
		mainWindow.webContents.send("consultaListaUsuarios", rows);
	}).catch(function(error) 
	{
		console.error(err);
		throw err;
  	});
}
);

// Búsqueda de clientes
ipcMain.on("searchClientName", (event, customerName) => 
{
	let resultado = 
	
	knex.raw("SELECT customer_list.customerID, customer_list.customerName, membership_catalogue.membershipName, customer_list.membershipBalance FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.customerName LIKE ? AND customer_list.deleted = 0", [customerName[0]]);

	resultado.then((rows) => 
	{
		console.log(rows);
		mainWindow.webContents.send("resultadosBusquedaClientes", rows);
	}).catch((err) => 
	{
		console.error(err);
		throw err;
	});
});

ipcMain.on("searchClientNumber", (event, customerNumber) =>
{
	let resultado = knex.raw("SELECT customer_list.customerID, customer_list.customerName, membership_catalogue.membershipName, customer_list.membershipBalance FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.customerID = ? AND customer_list.deleted = 0", customerNumber);
	
	resultado.then((rows) => 
	{
		mainWindow.webContents.send("resultadosBusquedaClientes", rows);
	}).catch((err) => 
	{
		console.error(err);
		throw err;
	});
}
);

ipcMain.on("searchClientPhone", (event, customerPhone) =>
{
	let resultado = knex.raw("SELECT customer_list.customerID, customer_list.customerName, membership_catalogue.membershipName, customer_list.membershipBalance FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.phoneNumber LIKE ? AND customer_list.deleted = 0", customerPhone);
	
	resultado.then((rows) => 
	{
		mainWindow.webContents.send("resultadosBusquedaClientes", rows);
	}).catch((err) => 
	{
		console.error(err);
		throw err;
	});
}
);

ipcMain.on("searchClientRemarks", (event, customerRemarks) =>
{
	let resultado = knex.raw("SELECT customer_list.customerID, customer_list.customerName, membership_catalogue.membershipName, customer_list.membershipBalance FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.clientRemarks LIKE ? AND customer_list.deleted = 0", customerRemarks);
	
	resultado.then((rows) => 
	{
		mainWindow.webContents.send("resultadosBusquedaClientes", rows);
	}).catch((err) => 
	{
		console.error(err);
		throw err;
	});
}
);

//}

//{  Código de la ventana para dar de alta un cliente
ipcMain.on("createUserWindowLoaded", () =>
{
	let resultado = knex.select("membershipID", "membershipName", "membershipBenefits").from("membership_catalogue").where("deleted", 0);
	
  	resultado.then((rows) => 
	{
		mainWindow.webContents.send("catalogoMembresias", rows);
	}).catch((err) => 
	{
		console.error(err);
		throw err;
	});
}
);

ipcMain.on("checkCurrentPrimaryKeyIndex", () =>
{
	let resultado = knex.select("seq").from("sqlite_sequence").where("name", "customer_list");
  
	resultado.then((rows) => 
	{
		mainWindow.webContents.send("currentPrimaryKeyIndexChecked", rows);
	}).catch((err) => 
	{
		console.error(err);
		throw err;
	});
}
);

ipcMain.on("customerInformation", (event, informacion) =>
{
	let today = new Date();
	let d = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();

	let insercion = knex("customer_list").insert(
	{
		customerID: informacion[0], 
		lastName: informacion[1][0], 
		firstName: informacion[1][1], 
		gender: informacion[2], 
		phoneNumber: informacion[4], 
		customerAddress: 
		informacion[3], 
		dateJoined: d.toString(), 
		membershipType: parseInt(informacion[5]), 
		membershipBalance: parseInt(informacion[6]), 
		clientRemarks: informacion[7], 
		deleted: informacion[8]
	}).then(mainWindow.webContents.send("customerSucessfullyCreated")).catch((err) => 
	{
		console.log(error); 
		throw err;
	});

});
//}

//{ código de la ventana para ver el perfil del cliente/editar información del cliente

ipcMain.on("getCustomerInformation", (evt, customerID) => 
{
	let resultado = knex("customer_list").select("customer_list.customerID", "customer_list.customerName", "customer_list.gender", "customer_list.phoneNumber", "customer_list.customerAddress", "customer_list.dateJoined", "membership_catalogue.membershipName", "customer_list.membershipBalance", "customer_list.clientRemarks").join("membership_catalogue", "customer_list.membershipType", "=",  "membership_catalogue.membershipID").where("customer_list.customerID", "=", [customerID], "AND", "customer_list.deleted", "=", 0);
	//let resultado = knex.raw("SELECT customer_list.customerID, customer_list.lastName, customer_list.firstName, customer_list.gender, customer_list.phoneNumber, customer_list.customerAddress, customer_list.dateJoined, membership_catalogue.membershipName, customer_list.membershipBalance, customer_list.clientRemarks FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.customerID = ? AND customer_list.deleted = 0", [customerID]);
	resultado.then((rows) => 
	{
		mainWindow.webContents.send("informacionClienteRecibida", rows);
	}
	).catch((err) => 
	{
		console.error(err);
		throw err;
	});
});

// Enviar la informacion para editar al cliente (la consulta debe casi exatamente igual a obtener la información)
ipcMain.on("editUserWindowLoaded", (evt, customerID) => 
{
	let resultado = knex.raw("SELECT customer_list.customerName, customer_list.gender, customer_list.phoneNumber, customer_list.customerAddress, customer_list.dateJoined, membership_catalogue.membershipName, customer_list.membershipBalance, customer_list.clientRemarks FROM customer_list JOIN membership_catalogue ON customer_list.membershipType = membership_catalogue.membershipID WHERE customer_list.customerID = ? AND customer_list.deleted = 0", [customerID]);

	resultado.then((rows) => 
	{
		mainWindow.webContents.send("informacionClienteRecibida", rows);
	}
	).catch((err) => 
	{
		console.error(err);
		throw err;
	}
	);
});

// Actualizar la informacion del cliente

ipcMain.on("updateCustomerInformation", (event, informacion) =>
{
	let today = new Date();
	let d = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();

	let insercion = knex.raw("UPDATE customer_list SET customerName = ?, gender = ?, phoneNumber = ?, customerAddress = ?, clientRemarks = ? WHERE customerID = ? AND deleted = 0", [informacion[0], informacion[1], informacion[3], informacion[2], informacion[4], parseInt(informacion[5])]);
	
	insercion.then(mainWindow.webContents.send("customerSucessfullyUpdated")).catch((err) => 
	{ 
		console.log(err); 
		throw err; 
	});

});

//}

//{ Poner mas saldo al cliente
ipcMain.on("getTopUpInformation", (event, customerID) => 
{
	let obtenerInformacion = knex("customer_list").select("customerID", "customerName", "membershipBalance").where("customerID", "=", customerID, "AND", "deleted", "=", 0);
	
	let resultado = knex.select("membershipID", "membershipName", "membershipBenefits").from("membership_catalogue").where("deleted", 0);
	
	resultado.then((rows) => 
	{
		mainWindow.webContents.send("catalogoMembresias", rows);
	}).catch((err) => 
	{
		console.error(err);
		throw err;
	});
	
	obtenerInformacion.then((rows) => 
	{
		mainWindow.webContents.send("informacionRecargaRecibida", rows);
	}).catch((err) => 
	{ 
		console.log(err); 
		throw err; 
	});
});

ipcMain.on("topUpClient", (event, informacion) => 
{
    let insercion = knex.raw("UPDATE customer_list SET membershipType = ?, membershipBalance = ? WHERE customer_list.customerID = ? and customer_list.deleted = 0", [informacion[0], informacion[1], informacion[2]]);
    insercion.then(mainWindow.webContents.send("topUpSucessful")).catch((err) => 
	{
		console.error(err);
		throw err;
	}).finally(() => 
	{
		insercion.destroy();
    });
	
}
);

//}
