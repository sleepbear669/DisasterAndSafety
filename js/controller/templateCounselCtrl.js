/**
 * Created by sleepbear on 15. 9. 13..
 */
(function (app) {
    app.controller("templateCounselCtrl", function($scope, $routeParams){
        $scope.roomId = $routeParams.roomId;
    })
})(disasterApp);