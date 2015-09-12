/**
 * Created by sleepbear on 15. 9. 11..
 */
disasterApp.factory('utill', function ($rootScope) {
    return {
        randomString : function(num){
            if(!num) num = 30;
            return Math.random().toString(36).substring(num);
        }
    };
});