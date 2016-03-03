// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myapp=angular.module('starter',['ionic', 'starter.controllers']);

myapp.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
});

//路由设置
myapp.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');

        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');


        //对php的post处理
        $httpProvider.defaults.transformRequest = function(request){
            if(typeof(request)!='object'){
                return request;
            }
            var str = [];
            for(var k in request){
                if(k.charAt(0)=='$'){
                    delete request[k];
                    continue;
                }
                var v='object'==typeof(request[k])?JSON.stringify(request[k]):request[k];
                str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
            return str.join("&");
        };
        $httpProvider.defaults.timeout=3000;
        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        };


  $stateProvider
  .state('tab', {
      url: "/tab",
      abstract:true,
      templateUrl: "templates/tabs.html",
      controller: 'TabCtrl'
  })
  .state('tab.main', {
    url: '/main',
    views: {
      'tab-main': {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      }
    }
  })
  .state('tab.setting', {
    url: '/setting',
    views: {
      'tab-setting': {
        templateUrl: 'templates/setting.html',
        controller: 'SettingCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/main');
});
