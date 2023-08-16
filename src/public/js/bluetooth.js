let bluetoothDevice;
let dateInput = document.getElementById('date');
let hourInput = document.getElementById('hour');
let connectButton = document.getElementById('connectButton');
let saveButton = document.getElementById('saveButton');
let bpm = document.getElementById('bpm');
let alrt = document.getElementById('alertas');

connectButton.addEventListener('click', onReadHeartRateButton);
saveButton.addEventListener('click', save);
/*Función principal para la activación del bluetooth
mediante el botón*/
function onReadHeartRateButton() {
  return (bluetoothDevice ? Promise.resolve() : requestDevice())
  .then(connectDeviceAndCacheCharacteristics)
  .then(_ => {
    setInterval(()=>{
      console.log('Leyendo Frecuencia Cardiaca...');
      return hr.readValue();
    },3000)
  })
  .catch(error => {
    console.log(error);
  });
}
/*Función que busca los dispositivos bluetooth mediante
filtros*/
function requestDevice() {
console.log('Buscando dispositivo bluetooth...');
  return navigator.bluetooth.requestDevice({
   filters: [{
    name: 'HEXIWEAR'
   }],
    optionalServices: [0x2020]})
  .then(device => {
    connectButton.innerHTML = 'Actualizar frecuencia';
    connectButton.style.backgroundColor = 'green';
    bluetoothDevice = device;
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
  });
}
/*Función que conecta con el dispositivo y obtiene los
servicios y características deseados (en este caso el
de frecuencia cardiaca) */
function connectDeviceAndCacheCharacteristics() {
  if (bluetoothDevice.gatt.connected && hr) {
    return Promise.resolve();
  }

  console.log('Conectando al servidor GATT...');
  return bluetoothDevice.gatt.connect()
  .then(server => {
    console.log('Obteniendo Servicio de Salud...');
    return server.getPrimaryService(0x2020);
  })
  .then(service => {
    console.log('Obteniendo caracteristica de frecuencia cardiaca...');
    return service.getCharacteristic(0x2021);
  })

  .then(characteristic => {
    hr = characteristic;
    hr.addEventListener('characteristicvaluechanged', bpmChanged);
  });
}
/*Función que imprime los datos de frecuencia cardiaca con fecha y hora */
function bpmChanged(event) {
  setInterval(()=>{
    let heartRate = event.target.value.getUint8(0);
    let now = new Date();
    let date = now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear();
    let hour = now.toLocaleTimeString(); 
    bpm.value = heartRate;
    dateInput.value = date;
    hourInput.value = hour; 
    console.log('> BPM ' + hr);
  }, 1000)
}
function save(){
  if(bpm.value == ''){
    window.alert('No hay datos, favor de conectar al dispositivo');
  }
  else{
    window.alert('Datos guardados correctamente');
  }
}
/*Manejadores de errores para una conexión bluetooth más estable */
function onStartNotificationsButtonClick() {
  console.log('Iniciando Notificaciones de Frecuencia Cardiaca...');
  hr.startNotifications()
  .then(_ => {
    console.log('> Notificaciones iniciadas');
    document.querySelector('#startNotifications').disabled = true;
    document.querySelector('#stopNotifications').disabled = false;
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function onResetButtonClick() {
  if (hr) {
    hr.removeEventListener('characteristicvaluechanged',
        handleBatteryLevelChanged);
    hr = null;
  }
  bluetoothDevice = null;
  console.log('> Bluetooth Device reset');
}

function onDisconnected() {
  log('> Bluetooth Device disconnected');
  connectDeviceAndCacheCharacteristics()
  .catch(error => {
    log('Argh! ' + error);
  })
}