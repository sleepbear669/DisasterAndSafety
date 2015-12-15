/**
 * Created by sleepbear on 15. 9. 13..
 */
(function (app) {
    app.controller("templateCounselCtrl", function ($scope, $routeParams, socket) {
        $scope.roomId = $routeParams.roomId;
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

        var pc;
        navigator.getUserMedia({video: true, audio: false}, function (localMediaStream) {
            pc = new RTCPeerConnection(configuration);
            localVideo.src = window.URL.createObjectURL(localMediaStream);
            localVideoStream = localMediaStream;
            pc.addStream(localVideoStream);
            init();
            socket.emit("counselor", $scope.roomId);
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
            pc.removeStream(localVideoStream);
            pc.close();
            socket.emit("leaveRoom", $scope.roomId);
        });
    });
})(disasterApp);