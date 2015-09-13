/**
 * Created by sleepbear on 15. 9. 11..
 */
var disasterApp = angular.module('disasterApp', ['ngRoute']);

disasterApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/counsel/:roomId', {
                templateUrl: '/template/counsel.html',
                controller: 'counselController'
            });
    }]);