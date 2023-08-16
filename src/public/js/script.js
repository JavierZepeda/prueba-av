let video;
let c2;
let socket = io();
let vida;
let poseNet;
let pose;
let skeleton;
let label;

let brain;
let options;
let poseLabel = 'NORMAL';

let time = new Date();

function setup(){
    c = createCanvas(830, 600).id('canvas');
    video = createCapture(VIDEO).id('video');
    video.size(415, 300);
    video.hide();
    movi();
    auxilio();
    caida();
    ausencia();
     /*Declaración de los elementos para la 
    utilización de la librería VIDA*/
    vida = new Vida();
    vida.progressiveBackgroundFlag = true;
    vida.imageFilterThreshold = 0.1;
    vida.mirror = vida.MIRROR_NONE;
    vida.handleBlobsFlag = true;
    vida.normMinBlobArea = 0.02;
    vida.normMaxBlobArea = 0.95;
    vida.trackBlobsFlag = true;
    vida.approximateBlobPolygonsFlag = true;
    vida.pointsPerApproximatedBlobPolygon = 8;
    frameRate(60); //Se fijan los FPS del video
    /*Declaración de los elementos para la
    utilización de la librería PoseNet (se colocan en 
    la misma función en la cual se incia el video)*/
    poseNet = ml5.poseNet(video);
    poseNet.on('pose', gotPoses);
    /*Opciones para la configuración de la red
    neuronal */
    options = {
        inputs: 34,
        outputs: 3,
        task: 'classification',
        debug: true
    }
    /*Inicialización de la red neuronal mediante
    la variable "brain" */
    brain = ml5.neuralNetwork(options);
    /*Referencia a los modelos que se van a ocupar*/
    const modelInfo = {
        model: 'models/model.json',
        metadata: 'models/model_meta.json',
        weights: 'models/model.weights.bin',
    }
    brain.load(modelInfo, classifyPose);

}
/*Función para comparar las coordenadas de 
PoseNet y compararlas con las del modelo*/
function classifyPose(){
    if(pose){
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        brain.classify(inputs, gotResults)
    }
    else{
        setTimeout(classifyPose, 200);
    }
}
function gotResults(error, results){
    if(results[0].confidence > 0.75){
        poseLabel = results[0].label.toUpperCase();
    }
    classifyPose();
}
/*Función para obtener los resultados (coordenadas) 
de PoseNet*/
function gotPoses(poses){
    if(poses.length > 0){
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}
/*Función para el dibujado de las liberías de 
PoseNet y Vida, así como la emisión hacía el 
cliente mediante la librería Socket.IO */
function draw(){
    if(video !== null && video !== undefined){
        /*Configuración de las ventanas de video
        y su posición, así como el texto de cada
        una y su posición dentro del canvas */
        background(0, 0, 255);
        vida.update(video);
        image(vida.currentImage, 0, 0);
        noStroke(); fill(0, 0, 0);
        text('CÁMARA', 10, 20);
        image(vida.differenceImage, 415, 0);
        fill(255, 255, 255);
        text('MOVIMIENTO', 430, 20);
        image(vida.thresholdImage, 0, 300)
        text('MOVIMIENTO 2', 20, 320);
        fill(0,0,0);
        image(video, 415, 300);
        text('POSE', 430, 320); 
        fill(0,0,0);
        /*Elementos necesarios para el
        blob tracking */
        var offset_x = 415;
        var offset_y = 300;
        push();
        translate(offset_x, offset_y);
        /*Se manda a llamar la función de dibujado de PoseNet 
        (para puntos y para el esqueleto)*/
        drawPoses();
    }
    else{
        background('#181f2a');
    }
    /*Configuraciones necesarias para enviar la imagen hacia
    el cliente */
    socket.emit('stream', c.canvas.toDataURL('image/webp'));
    //console.log('emitiendo');
}
/*Función para el dibujado de los puntos
de PoseNet */
function drawPoses(){
    push();
    if(pose){
        for(let i = 0; i < skeleton.length; i++){
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(0, 255, 0);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
        for(let i = 0; i < pose.keypoints.length; i++){
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            if(pose.keypoints.length > 1){
                fill(255, 0, 0);
                noStroke();
                ellipse(x, y, 6, 6);
            }
        }
    }
    pop();
    fill(255, 255, 0);
    noStroke();
    textSize(27);
    text(poseLabel, 250, 290);
}
/*Función para el reconocimiento de
movimiento mediante la librería Vida */
function movi(){
    socket.on('alert1', (inputA1) => {
        let move = vida.getBlobs();
        let valueMovi = inputA1
        console.log('Tiempo MOVI' + valueMovi);
        let printMovi = function(){
            let alertMovi = 'Sin movimiento ' +  time.toLocaleTimeString();
            /*Configuración para emitir la 
            alerta hacia el cliente */
            socket.emit('alertaMovi', alertMovi);
            //console.log('Sin movimiento');
            if (move > 1){
                clearTimeout(timeMovi);
            }
        }
        let timeMovi = function(){
            setTimeout(printMovi, valueMovi);
        }
        setInterval(()=> {
            if(move < 1){
                timeMovi();
            }
            else{
                clearTimeout(timeMovi);
            }
            return false;
        },2400);        
    });
}
/*Función para el reconocimiento de la
 señal de axucio con la librería PoseNet */
function auxilio(){
    socket.on('alert2', (inputA2) =>{
        let valueAux = inputA2;
        console.log('Tiempo AUX' + valueAux);
        let printAuxilio = function(){
            let alertaAux = 'Auxilio detectado ' + time.toLocaleTimeString();
            /*Configuración para emitir la 
            alerta hacia el cliente */
            socket.emit('alertaAux', alertaAux);
            //console.log('Auxilio');
            if (poseLabel == 'CAÍDA'){
                clearTimeout(timeAuxilio);
            }
        }
        let timeAuxilio = function(){
            setTimeout(printAuxilio, valueAux);
        }
        setInterval(()=>{
            if(poseLabel == 'AUXILIO'){
                timeAuxilio();
            }
            else{
                clearTimeout(timeAuxilio)
            }
        },2400);
    })
}
/*Función para el reconocimiento caídas
 con la librería PoseNet */
function caida(){
    socket.on('alert3', (inputA3) => {
        valueCaida = inputA3;
        console.log('Tiempo CAIDA' + valueCaida);
        let printCaida = function(){
            let alertaCaida = 'Caída detectada ' + time.toLocaleTimeString();
            /*Configuración para emitir la 
            alerta hacia el cliente */
            socket.emit('alertaCaida', alertaCaida);
            //console.log('Caída');
            if  (poseLabel == 'AUXILIO'){
                clearTimeout(timeCaida);
            }
        }
        let timeCaida =  function(){
            setTimeout(printCaida, valueCaida);
        }
        setInterval(()=>{
            if(poseLabel == 'CAÍDA'){
                timeCaida();
            }
            else{
                clearTimeout(timeCaida);
            }
        }, 2400);
    })
}
/*Función para el reconocimiento ausencia o
 presencia con la librería PoseNet */
 function ausencia(){
     socket.on('alert4', (inputA4) =>{
        valueAusencia = inputA4;
        console.log('Tiempo AUSEN' + valueAusencia);
        let printAusencia = function(){
            let alertaAusencia = 'Ausencia ' + time.toLocaleTimeString();    
            /*Configuración para emitir la 
            alerta hacia el cliente */
            socket.emit('alertaAusencia', alertaAusencia);
            //console.log('Ausencia');
            if (pose){
                clearTimeout(timeAusencia);
            }
        }
        let timeAusencia = function(){
            setTimeout(printAusencia, valueAusencia);
        }
        setInterval(()=>{
            if(!pose){
                timeAusencia();   
            }
            else{
                clearTimeout(timeAusencia);
            }
        }, 2400);
     })
}

function touchEnded(){
    if(video !== null && video !== undefined){
        vida.setBackgroundImage(video);
    }
}