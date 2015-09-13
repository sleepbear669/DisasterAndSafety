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
var rooms = {};
var userType = {};
var io = require('socket.io').listen(server).sockets;
io.on('connection', function (socket) {
    socket.on('event', function(data){});
    socket.on('disconnect', function(){
        if(userType[socket.id] === "report") {
            socket.broadcast.in(rooms[socket.id]).emit('end');
            socket.leave(rooms[socket.id]);
            delete rooms[socket.id];
            socket.broadcast.emit("receive", rooms);
        }
    });
    socket.on("report", function (room) {
        socket.roomId = room;
        rooms[socket.id] = room ;
        userType[socket.id] = "report";
        socket.join(room);
        socket.broadcast.emit("receive", rooms);
    });
    socket.on('message', function (message) { });
    socket.on("offer", function (desc) {
        socket.broadcast.to(socket.roomId ).emit("offer", desc);
    });
    socket.on("icecandidate", function (candidate) {
        socket.broadcast.to(socket.roomId ).emit("addCandidate", candidate);
    });
    socket.on("answer", function (answer) {
        socket.broadcast.to(socket.roomId).emit("complete", answer);
    });
    socket.on("counselor", function (roomId) {
        userType[socket.id] = "counselor";
        socket.roomId = roomId;
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("counselorJoin");
    });
    socket.on("leaveRoom", function (roomId) {
        socket.leave(roomId);
    })
});

