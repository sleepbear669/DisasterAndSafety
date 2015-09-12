/**
 * Created by sleepbear on 15. 9. 12..
 */
(function (app) {
    app.controller("counselorController", function($scope, socket){
        socket.on("receive", function(rooms){
            $scope.rooms = rooms;
        })
    })
})(disasterApp);