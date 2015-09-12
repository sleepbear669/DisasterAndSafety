/**
 * Created by sleepbear on 15. 9. 11..
 */
(function(app){
    app.controller('reportController', function($scope, socket, utill){

        var errorCallback = function(e) {
            console.log('Reeeejected!', e);
        };
        var localDesc;
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

        var pc = new webkitRTCPeerConnection(configuration);
        navigator.getUserMedia({video: true, audio: false}, function (localMediaStream) {
            localVideo.src = window.URL.createObjectURL(localMediaStream);
            localVideoStream = localMediaStream;
            pc.addStream(localVideoStream);
            init();
            var roomId = utill.randomString(7);
            socket.emit("report", roomId);
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
        $scope.start = function () {
            console.log("strat");
            pc.createOffer(function (desc) {
                pc.setLocalDescription(desc, function () {
                    localDesc = desc;
                    socket.emit("offer", desc);
                });
            });
        };
        socket.on("message", function (message) {
            if(message.type == "offer") {
                remoteDecs = message;
            }

        });
        socket.on("offer", function(offer) {
            remoteDecs = offer;
            pc.setRemoteDescription(new RTCSessionDescription(offer));
            pc.createAnswer(function (answer) {
                pc.setLocalDescription(answer);
                socket.emit("answer", answer);
            });
        });
        socket.on("addCandidate", function (candidate) {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
        });
        socket.on("complete", function (answer) {
            pc.setRemoteDescription(new RTCSessionDescription(answer));
        });0
    })
})(disasterApp)