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

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
	webPreferences: {
    nodeIntegration: true
	}
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'views/customers/createCustomer.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  
  //{Custom menu
  var menu = Menu.buildFromTemplate([
      {
          label: 'Menu',
          submenu: [
              {label:'Customer Information',
				  click() {
					  openCustomerWindow();
				  },
				  accelerator: 'F5'
			  },
              {label:'Garments list',
				  click() {
					  openGarmentsWindow();
				  },
				  accelerator: 'F3'
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

//{ Código de la ventana principal de la aplicación 
// Cada ventana debe tener su función propia para abrir y cerrar. El numero de variables indica la cantidad de instancias que se va a tener. Si solo se usa una variable, los atajos de teclado dejan de funcionar hasta que la ventana se cierre.


function openOrdersWindow() 
{
	var ordersWindow = null;
	
	if (ordersWindow) 
	{
		ordersWindow.focus();
		return;
	}

	ordersWindow = new BrowserWindow({
		height: 800,
		width: 600,
		title: '',
		fullscreenable: false
	});

  ordersWindow.loadFile(path.join(__dirname, 'views/orders/index.html'));

	ordersWindow.on('closed', function() {
		ordersWindow = null;
	});
}

function openCustomerWindow() 
{
	var customerWindow = null;
	
	if (customerWindow) 
	{
		customerWindow.focus();
		return;
	}

	customerWindow = new BrowserWindow({
		height: 800,
		width: 600,
		title: '',
		fullscreenable: false
	});

	customerWindow.loadFile(path.join(__dirname, 'views/customers/index.html'));

	customerWindow.on('closed', function() {
		customerWindow = null;
	});
}

function openGarmentsWindow() 
{
	var newWindow = null;
	if (newWindow) 
	{
		newWindow.focus();
		return;
	}

	newWindow = new BrowserWindow({
		height: 800,
		width: 600,
		title: '',
		fullscreenable: false
	});

	newWindow.loadFile(path.join(__dirname, 'views/garments/index.html'));

	newWindow.on('closed', function() {
		newWindow = null;
	});
}

// Detectar si un botón de la barra de herramientas ha sido presionado e invocar la función necesaria

ipcMain.on('open-orders', function()
{
  openOrdersWindow();
});

ipcMain.on('open-users', function()
{
    openCustomerWindow();
});

ipcMain.on('open-garments', function()
{
    openGarmentsWindow();
});
//}

//{ codigo de la página principal de clientes

ipcMain.on("customersIndexWindowLoaded", function()
{
  let resultado = knex.select().from("customer_list").where("deleted", 0);
  resultado.then(function(rows){mainWindow.webContents.send("consultaListaUsuarios", rows);}).catch(function(error) {
    console.error(error);
  });
}
);
//}

//{ Código de la ventana para dar de alta un cliente
ipcMain.on("createUserWindowLoaded", function()
{
  let resultado = knex.select("membershipID", "membershipName", "membershipBenefits").from("membership_catalogue").where("deleted", 0);
  resultado.then(function(rows){mainWindow.webContents.send("catalogoMembresias", rows);}).catch(function(error) {
    console.error(error);
  });
  
  console.log(resultado);
}
);
//}