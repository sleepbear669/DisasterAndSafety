/**
 * Created by sleepbear on 15. 9. 11..
 */
disasterApp.controller('reportController', function($scope, socket){
    socket.on("message", function(data){
        console.log(data);
    })
    console.log("Dtad");
    $scope.bindingTest = 'hello world';
})