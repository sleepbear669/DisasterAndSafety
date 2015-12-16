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
        var remoteVideo = document.getElementById('remote');
        var localVideoStream;
        var pc;
        $scope.start = start;
        function start() {
            console.log("start");
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

            pc = new webkitRTCPeerConnection(configuration);
            navigator.getUserMedia({video: true, audio: true}, function (localMediaStream) {
                localVideoStream = localMediaStream;
                pc.addStream(localVideoStream);
                init();
                $scope.roomId = utill.randomString(7);
                socket.emit("report", $scope.roomId);
            }, errorCallback);
        }
        var init = function () {
            pc.onaddstream = function (obj) {
                remoteVideo.src = window.URL.createObjectURL(obj.stream);
            };
            pc.onicecandidate = function (event) {
                if (!event || !event.candidate) return;
                socket.emit("icecandidate", event.candidate);
            };
        };
        socket.on("counselorJoin", function () {
            pc.createOffer(function (desc) {
                pc.setLocalDescription(desc, function () {
                    localDesc = desc;
                    socket.emit("offer", desc);
                });
            });
        });

        socket.on("message", function (message) {
            if(message.type == "offer") {
                remoteDecs = message;
            }
        });
        socket.on("addCandidate", function (candidate) {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
        });
        socket.on("complete", function (answer) {
            pc.setRemoteDescription(new RTCSessionDescription(answer));
        });
    })
})(disasterApp);