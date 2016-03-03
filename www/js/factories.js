angular.module('starter.factories', [])
    .factory('HttpClient', function ($http) {
        /*.success 方法中 function 的参数 其实是 response.data*/
        var myService = {
            async: function (config) {

                var promise = $http(config).then(function (response) {
                    console.log(response);
                    return response.data;
                });
                console.log(promise);
                return promise;
            }
        };
        return myService;
    })
    .factory('UserData', function($rootScope){
        var localstorage = window.localStorage;
        var service = {};
        if(localstorage["stuNum"]){
            service.name = localstorage["name"];
            service.college = localstorage['college'];
        }else{
            service.name = "煎饼侠";
            service.college = "那我就叫麻辣小龙侠吧！";
        }


        service.updatainfo = function(n,c){
            this.name = n;
            this.college = c;
            $rootScope.$broadcast("valuesUpdated");
        };

        return service;
    });
