let day;
let month;
let year;

let bdButton = document.getElementById('base');
let emotionButton = document.getElementById('emotion');
let monitorButton = document.getElementById('monitoreo');
let saludButton = document.getElementById('salud');
let objMenuButton = document.getElementById('objetos');
let button = document.getElementById('button');
let emotionsButton = document.getElementById('emotionsButton');
let objButton = document.getElementById('objButton');
let activateEmotions = document.getElementById('emotionsButton');
let inputA1 = document.getElementById('alerta1');
let inputA2 = document.getElementById('alerta2');
let inputA3 = document.getElementById('alerta3');
let inputA4 = document.getElementById('alerta4');
let inputAObj = document.getElementById('alertaObj');
let setTimeA1 = document.getElementById('setAlerta1');
let setTimeA2 = document.getElementById('setAlerta2');
let setTimeA3 = document.getElementById('setAlerta3');
let setTimeA4 = document.getElementById('setAlerta4');
let setTimeAObj = document.getElementById('setAlertaObj');
let clock = document.getElementById('reloj');
let clearButton = document.getElementById('clearHistB');
let saveAMButton = document.getElementById('saveAM');
let saveContactButton = document.getElementById('saveContact');

let emotionsTimeBox = document.getElementById('emotionsTimeBox');
let monitorTimeBox = document.getElementById('monitorTimeBox');
let objTimeBox = document.getElementById('objectTimeBox');
let alertas = document.getElementById('alertas');
let monitor = document.getElementById('videos');
let salud = document.getElementById('sectionSalu');
let img = document.getElementById('play');
let imgEmotions = document.getElementById('imgEmotions');
let imgObj = document.getElementById('imgObj');
let bd = document.getElementById('bd');
let emotions = document.getElementById('videoEmotion');
let sectionObj = document.getElementById('sectionObj');

let socket = io();

function setup(){
    setInterval(function(){
        let tiempo = new Date();
        day = tiempo.getDate();
        month = tiempo.getMonth();
        year = tiempo.getFullYear();
        clock.innerHTML = (`${day}/${month}/${year}`+ ' ' + tiempo.toLocaleTimeString());
    }, 1000);
    /*Botón para iniciar la transmisión de
    monitoreo */
    button.addEventListener('click', function(){
        socket.on('stream', (image) => {
            img.src = image;
        });
        button.addEventListener('click', desactivar);
        button.innerHTML = 'Detener transmisión';
        img.style.display = 'block';
    });
    /*Botón para iniciar la transmisión de
    emociones */
    emotionsButton.addEventListener('click', function(){
        socket.on('streamEmotions', (image) =>{
            imgEmotions.src = image;
        });
        emotionsButton.addEventListener('click', desactivarEmocion);
        emotionsButton.innerHTML = 'Detener emociones';
        imgEmotions.style.display = 'block';
    })
    /*Botón para iniciar la transmisión de
    objetos */
    objButton.addEventListener('click', function(){
        socket.on('streamObj', (image) =>{
            imgObj.src = image;
        });
        objButton.addEventListener('click', desactivarObj);
        objButton.innerHTML = 'Detener objetos';
        imgObj.style.display = 'block';
    })
    clearButton.addEventListener('click', clearHist);

    setTimeA1.addEventListener('click', setTimeAux);
    setTimeA2.addEventListener('click', setTimeCaida);
    setTimeA3.addEventListener('click', setTimeMove);
    setTimeA4.addEventListener('click', setTimeAus);
    setTimeAObj.addEventListener('click', setTimeObj);

    bdButton.addEventListener('click', showBd);
    emotionButton.addEventListener('click', showEmotions);
    monitorButton.addEventListener('click', showMonitor);
    saludButton.addEventListener('click', showSalud);
    objMenuButton.addEventListener('click', showObj);

    saveAMButton.addEventListener('click', saveAM);
    saveContactButton.addEventListener('click', saveContact);
}

function clearHist(){
    alertas.innerHTML = '';
}

function desactivar(){
    button.addEventListener('click', function(){
        button.innerHTML = 'Detener transmisión';
        img.style.display = 'block';
        button.addEventListener('click', reanudar());
    });
    button.innerHTML = 'Reanudar transmisión';
    img.style.display = 'none';
}

function reanudar(){
    button.addEventListener('click', function(){
        img.style.display = 'none';
        button.addEventListener('click', desactivar());
    });
    button.innerHTML = "Detener transmisión";
    img.style.display = 'block';
}

function desactivarEmocion(){
    emotionsButton.addEventListener('click', function(){
        emotionsButton.innerHTML = 'Detener emociones';
        imgEmotions.style.display = 'block';
        emotionsButton.addEventListener('click', reanudarEmociones());
    });
    emotionsButton.innerHTML = 'Reanudar emociones';
    imgEmotions.style.display = 'none';
}

function reanudarEmociones(){
    emotionsButton.addEventListener('click', function(){
        imgEmotions.style.display = 'none';
        emotionsButton.addEventListener('click', desactivarEmocion());
    });
    emotionsButton.innerHTML = "Detener emociones";
    imgEmotions.style.display = 'block';
}

function desactivarObj(){
    objButton.addEventListener('click', function(){
        objButton.innerHTML = 'Detener objetos';
        objButton.style.display = 'block';
        objButton.addEventListener('click', reanudarObj());
    });
    objButton.innerHTML = 'Reanudar objetos';
    imgObj.style.display = 'none';
}

function reanudarObj(){
    objButton.addEventListener('click', function(){
        imgObj.style.display = 'none';
        objButton.addEventListener('click', desactivarObj());
    });
    objButton.innerHTML = "Detener objetos";
    imgObj.style.display = 'block';
}

function showBd(){
    monitor.style.display = 'none';
    emotions.style.display = 'none'
    bd.style.display = 'flex';
    button.style.display ='block';
    activateEmotions.style.display = 'none'
    emotionsTimeBox.style.display = 'none'
    monitorTimeBox.style.display = 'block';
    salud.style.display = 'none';
    sectionObj.style.display = 'none';
    objTimeBox.style.display = 'none'
    objButton.style.display = 'none';
}

function showMonitor(){
    monitor.style.display = 'block';
    emotions.style.display = 'none';
    bd.style.display = 'none';
    button.style.display ='block';
    activateEmotions.style.display = 'none';
    emotionsTimeBox.style.display = 'none';
    monitorTimeBox.style.display = 'block';
    salud.style.display = 'none';
    sectionObj.style.display = 'none';
    objTimeBox.style.display = 'none'
    objButton.style.display = 'none';
}

function showEmotions(){
    monitor.style.display = 'none';
    emotions.style.display = 'block';
    bd.style.display = 'none';
    button.style.display = 'none';
    activateEmotions.style.display = 'block';
    emotionsTimeBox.style.display = 'block'
    monitorTimeBox.style.display = 'none';
    emotionsTimeBox.style.height = '124px';
    salud.style.display = 'none';
    sectionObj.style.display = 'none';
    objTimeBox.style.display = 'none'
    objButton.style.display = 'none';
}

function showSalud(){
    monitor.style.display = 'none';
    emotions.style.display = 'none';
    bd.style.display = 'none';
    button.style.display = 'block';
    activateEmotions.style.display = 'none';
    emotionsTimeBox.style.display = 'none'
    monitorTimeBox.style.display = 'block';
    emotionsTimeBox.style.height = '124px';
    salud.style.display = 'block'
    sectionObj.style.display = 'none';
    objTimeBox.style.display = 'none'
    objButton.style.display = 'none';
}

function showObj(){
    monitor.style.display = 'none';
    emotions.style.display = 'none';
    bd.style.display = 'none';
    button.style.display = 'none';
    activateEmotions.style.display = 'none';
    emotionsTimeBox.style.display = 'none'
    monitorTimeBox.style.display = 'none';
    emotionsTimeBox.style.height = '124px';
    salud.style.display = 'none';
    sectionObj.style.display = 'block';
    objTimeBox.style.display = 'block';
    objTimeBox.style.height = '124px';
    objButton.style.display = 'block';
}
/*Funciones que establecen el timer de las
alertas*/
function setTimeAux(){
    if(inputA1.value == '' || inputA1 == 0){
        window.alert('Favor de establecer el timer');      
    }
    else{
        socket.emit('alert1', (inputA1.value * 1000));
        window.alert('tiempo de movimiento ' + (inputA1.value));
    }
}

function setTimeCaida(){
    if(inputA2.value == '' || inputA2 == 0){
        window.alert('Favor de establecer el timer');
    }
    else{
        socket.emit('alert2', (inputA2.value * 1000));
        window.alert('tiempo de auxilio ' + (inputA2.value));
    }
}

function setTimeMove(){
    if(inputA3.value == '' || inputA3 == 0){
        window.alert('Favor de establecer el timer');
    }
    else{
        socket.emit('alert3', (inputA3.value * 1000));
        window.alert('tiempo de caída ' + (inputA3.value));
    }
}

function setTimeAus(){
    if(inputA4.value == '' || inputA4 == 0){
        window.alert('Favor de establecer el timer');
    }
    else{
        socket.emit('alert4', (inputA4.value * 1000));
        window.alert('tiempo de ausencia ' +(inputA4.value));
    }
}

function setTimeObj(){
    if(inputAObj.value == '' || inputAObj == 0){
        window.alert('Favor de establecer el timer');      
    }
    else{
        socket.emit('alertObj', (inputAObj.value * 1000));
        window.alert('Tiempo para intrusos ' + (inputAObj.value));
    }
}
/*Funciones que reciben la alerta desde el servidor
y la imprimen en el área de historial de alertas*/
function alertMovi(){
    socket.on('alertaMovi', (alertaMovi) =>{
        alertas.innerHTML += `<p>${alertaMovi}</p>`
    });
}

function alertAux(){
    socket.on('alertaAux', (alertaAux) =>{
        alertas.innerHTML += `<p>${alertaAux}</p>`
    });
}

function alertaCaida(){
    socket.on('alertaCaida', (alertaCaida) =>{
        alertas.innerHTML += `<p>${alertaCaida}</p>`
    });
}

function alertaAusencia(){
    socket.on('alertaAusencia', (alertaAusencia) =>{
        alertas.innerHTML += `<p>${alertaAusencia}</p>`
    });
}

function alertaIntruso(){
    socket.on('alertaObj', (alertaObj) =>{
        alertas.innerHTML += `<p>${alertaObj}</p>`
    });
}

function saveAM(){
    window.alert('Datos guardados Correctamente');
}

function saveContact(){
    window.alert('Datos guardados corre ctamente');
}

alertMovi()
alertAux();
alertaCaida();
alertaAusencia();
alertaIntruso();