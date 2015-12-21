/**
 * Created by sleepbear on 15. 9. 12..
 */
(function (app) {
    app.controller("counselorController", function ($scope, socket) {
        socket.on("receive", function (rooms) {
            $scope.rooms = rooms;
        });
        $scope.callReport = callReport;
        var errorCallback = function (e) {
            console.log('Reeeejected!', e);
        };
        var remoteDecs;
        var localVideo = document.getElementById('local');
        var remoteVideo = document.getElementById('remote');
        var localVideoStream;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        var configuration = {
            "iceServers": [
                {
                    "url": "stun:mmt-stun.verkstad.net"
                },
                {
                    "url": "turn:mmt-turn.verkstad.net",
                    "username": "webrtc",
                    "credential": "secret"
                }
            ]
        };
        function callReport(roomId) {
            socket.emit("counselor", roomId);
        };
        var pc;
        navigator.getUserMedia({video: true, audio: true}, function (localMediaStream) {
            pc = new webkitRTCPeerConnection(configuration);
            localVideo.src = window.URL.createObjectURL(localMediaStream);
            localVideoStream = localMediaStream;
            pc.addStream(localVideoStream);
            init();
        }, errorCallback);

        var init = function () {
            pc.onaddstream = function (obj) {
                remoteVideo.src = window.URL.createObjectURL(obj.stream);
            };
            pc.onicecandidate = function (event) {
                if (!event || !event.candidate) return;
                socket.emit("icecandidate", event.candidate);
            };
        }
        socket.on("message", function (message) {
            if (message.type == "offer") {
                remoteDecs = message;
            }
        });
        socket.on("offer", function (offer) {
            remoteDecs = offer;
            if(pc.signalingState != "closed") {
                pc.setRemoteDescription(new RTCSessionDescription(offer));
                pc.createAnswer(function (answer) {
                    pc.setLocalDescription(answer);
                    socket.emit("answer", answer);
                });
            }

        });
        socket.on("addCandidate", function (candidate) {
            if(pc.signalingState != "closed") {
                pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });
        socket.on("end", function () {
            pc.close();
            socket.emit("leaveRoom", $scope.roomId);
        });
    });
})(disasterApp);