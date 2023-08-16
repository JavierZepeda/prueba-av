let video;
let c2;
let detector;
let detections = [];
let socket = io();

let hora = new Date();
/*Función que define los elementos de video y canvas utilizando P5*/
function setup(){
    c2 = createCanvas(640, 480);
    video = createCapture(VIDEO, objDetect);
    video.size(640, 480);
    video.hide();
    intruso();
}
/*Función que define el modelo de detección de objetos*/
function objDetect() {
    detector = ml5.objectDetector('cocossd', modelReady); //Puede cambiarse 'yolo' por 'cocossd'
}
/*Función que inicializa la librería de detección*/
function modelReady() {
    detector.detect(video, gotDetections);
}
/*Función de detección */
function gotDetections(error, results) {
    if (error) {
      console.error(error);
    }
    detections = results;
    detector.detect(video, gotDetections);
    /*Configuraciones necesarias para enviar la imagen hacia
    el cliente */
    socket.emit('streamObj', c2.canvas.toDataURL('image/webp'));
}
/*Función que dibuja en el canvas un recuado y el nombre del
objeto detectado*/
function draw() {
    image(video, 0, 0);
    for (let i = 0; i < detections.length; i++) {
      const object = detections[i];
      stroke(200, 0, 215);
      strokeWeight(4);
      noFill();
      rect(object.x, object.y, object.width, object.height);
      noStroke();
      fill(255);
      textSize(27);
      text(object.label, object.x + 10, object.y + 24);
    }
}

function intruso(){
    socket.on('alertObj', (inputAObj) =>{
        let valueObj = inputAObj;
        console.log('Tiempo INTRUSO ' + valueObj);
        let printObj = function(){
            let alertaObj = 'Intruso detectado ' + hora.toLocaleTimeString();    
            /*Configuración para emitir la 
            alerta hacia el cliente */
            socket.emit('alertaObj', alertaObj);
            console.log('Intrusos');
            if (detections[detections.length - 1].label !== 'person'){
                clearTimeout(timeObj);
            }
        }
        let timeObj = function(){
            setTimeout(printObj, valueObj);
        }
        setInterval(()=>{
            if(detections[0].label == 'person'){
                timeObj();   
            }
            else if(detections[detections.length - 1].label !== 'person'){
                clearTimeout(timeObj);
            }
        }, 2400);
     });
}