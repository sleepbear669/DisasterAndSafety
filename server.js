/**
 * Created by sleepbear on 15. 9. 11..
 */
/**
 * Created by sleepbear on 2015-09-01.
 */
var os = require('os');
var static = require('node-static');
var http = require('http');


var fileServer = new(static.Server)();
var server = http.createServer(function(request, reponse){
    fileServer.serve(request, reponse);
});
var webSocketsServerPort = 8080;
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

var io = require('socket.io').listen(server).sockets;
io.on('connection', function (socket) {
    console.log(socket.id);
    socket.emit("message", "hello world");
    socket.on('event', function(data){});
    socket.on('disconnect', function(data){
        console.log("disconnet");
        if(data) {
            console.log(data);
        }
    });
    socket.on('message', function (message) { });
    socket.on("offer", function (desc) {
        socket.broadcast.emit("offer", desc);

    });
    socket.on("icecandidate", function (candidate) {
        socket.broadcast.emit("addCandidate", candidate);
    });
    socket.on("answer", function (answer) {
        socket.broadcast.emit("complete", answer);
    });
});

