/**
 * Created by sleepbear on 15. 9. 11..
 */
disasterApp.controller('reportController', function($scope, socket){


    var errorCallback = function(e) {
        console.log('Reeeejected!', e);
    };
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    navigator.getUserMedia({video: true, audio: false}, function (localMediaStream) {
        var localCamera = document.getElementById("local");
        localCamera.src = window.URL.createObjectURL(localMediaStream);
    }, errorCallback);


    socket.on("message", function(data){
        console.log(data);
    })
    console.log("Dtad");
    $scope.bindingTest = 'hello world';
})