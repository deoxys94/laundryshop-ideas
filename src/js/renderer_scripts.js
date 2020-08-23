var ipcRenderer = require('electron').ipcRenderer;
var abrirOrdenes = document.getElementById('ordersButton');
var abrirGestionUsuarios = document.getElementById('customersButton');
var abrirListaRopa = document.getElementById('garmentsButton');

abrirOrdenes.addEventListener('click', () => {
	ipcRenderer.send('open-orders');
});
abrirGestionUsuarios.addEventListener('click', () => {
	ipcRenderer.send('open-users');
});

abrirListaRopa.addEventListener('click', () => {
	ipcRenderer.send('open-garments');
});
