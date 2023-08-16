if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js')
    .then(reg =>console.log('Registro de Service Worker Exitoso', reg))
    .catch(err=>console.warn('Error', err));
}