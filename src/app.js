const express = require('express');
const app = express();
const myConnection = require('express-myconnection');
const mysql = require('mysql');
const {urlencoded}  = require('express');
const morgan = require('morgan');
const http = require('http').Server(app);
const io = require('socket.io')(http);
    
//Midlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'bd3e8212b13f47',
    password: '4f84bc58',
    port: '3306',
    database: 'heroku_84309d00491bc57' 
}, 'single'));
app.use(express.urlencoded({extended: false}));

io.on('connection', (socket) => {
    /*Escucha el evento stream y lo emite
    hacia el cliente*/
    socket.on('stream', (image) => {
        socket.broadcast.emit('stream', image);
    });
    socket.on('streamEmotions', (image) => {
        socket.broadcast.emit('streamEmotions', image);
    });
    socket.on('streamObj', (image) => {
        socket.broadcast.emit('streamObj', image);
    });
    /*Escuha el evento alert1 y lo emite 
    hacia el servidor*/
    socket.on('alert1', (data) =>{
        io.sockets.emit('alert1', data);
        console.log(data);
    });
    socket.on('alertaMovi', (alertMovi) => {
        io.sockets.emit('alertaMovi', alertMovi);
    })
    /*Escucha el evento alert2 y lo emite
    hacia el servidor*/
    socket.on('alert2', (inputA2)=>{
        io.sockets.emit('alert2', inputA2);
        console.log(inputA2);
    });
    socket.on('alertaAux', (alertaAux) => {
        io.sockets.emit('alertaAux', alertaAux);
    })
    /*Escucha el evento alert3 y lo emite 
    hacia el servidor*/
    socket.on('alert3', (inputA3)=>{
        io.sockets.emit('alert3', inputA3);
        console.log(inputA3);
    });
    socket.on('alertaCaida', (alertaCaida) => {
        io.sockets.emit('alertaCaida', alertaCaida);
    });
    /*Escucha el evento alert4 y lo emite
    hacia el servidor*/
    socket.on('alert4', (inputA4)=>{
        io.sockets.emit('alert4', inputA4);
        console.log(inputA4);
    });
    socket.on('alertaAusencia', (alertaAusencia) => {
        io.sockets.emit('alertaAusencia', alertaAusencia);
    });
    /*Escucha el evento alertObj y lo emite
    hacia el servidor*/
    socket.on('alertObj', (inputAObj)=>{
        io.sockets.emit('alertObj', inputAObj);
        console.log(inputAObj);
    });
    socket.on('alertaObj', (alertaObj) => {
        io.sockets.emit('alertaObj', alertaObj);
    });
})

//se define de donde se van a cargar los archivos html
app.use(express.static(__dirname + '/public'));

//rutas
app.use(require('./routes/streaming_routes'));

module.exports = http;