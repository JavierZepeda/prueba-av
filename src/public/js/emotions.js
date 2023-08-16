let emotionsVideo;
let c2;
let video;
let faceapi;
let detections;
let socket = io();

let videoEmotion = document.getElementById('videoEmotion');
let emotionsButton = document.getElementById('emotionsButton');
let inputE = document.getElementById('alertaEmotion');
let setTimeEmotion = document.getElementById('setAlertaE');
let img = document.getElementById('imgEmotions');
let alerts = document.getElementById('alertas');

function setup(){
    c2 = createCanvas(830, 600);
    video = createCapture(VIDEO).size(width, height).hide();
    /*Declaración de los elementos para la
    utilización de la librería Faceapi (se colocan en 
    la misma función en la cual se incia el video)*/
    const detection_options = {
        withLandmarks: true,
        withDescriptors: false,
    }
    faceapi = ml5.faceApi(video, detection_options)
    faceapi.detect(gotResults);
    textAlign(RIGHT);
}
/*Función para obtener los resultados arrjados
por la librería faceapi */
function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    background(255);
    image(video, 0,0, width, height)
    if (detections) {
        /*Si la cámara detecta algún rostro
        entonces manda a llamar a las funciones
        para el dibujado de del contorno y las
        expresiones */
        if (detections.length > 0) {
            // console.log(detections)
            drawBox(detections);
        }

    }
    faceapi.detect(gotResults);
    /*Configuraciones necesarias para enviar la imagen hacia
    el cliente */
    socket.emit('streamEmotions', c2.canvas.toDataURL('image/webp'));
}
/*Función para el dibujado de el cuadrado 
alrededor de la cara (bounding box) */
function drawBox(detections){
    for(let i = 0; i < detections.length; i++){
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x
        const y = alignedRect._box._y
        const boxWidth = alignedRect._box._width
        const boxHeight  = alignedRect._box._height
        
        noFill();
        stroke(161, 95, 251);
        strokeWeight(4);
        rect(x, y, boxWidth, boxHeight);
    }
}