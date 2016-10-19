var app = angular.module('app', ['ionic', 'firebase', 'ngCordova']);

app.constant('FIREBASE_URL', 'https://shining-inferno-3102.firebaseio.com/chatapp');

app.run(function(Auth, User, $rootScope, $ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  Auth.$onAuth(function(auth) {
    if (auth) {
      $rootScope.currentUser = User(auth.uid);
    } else {
      if ($rootScope.currentUser) {
        $rootScope.currentUser = null;
        $state.go('home');
      }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider
    .state('home', {
      cache: false,
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })

    .state('login', {
      cache: false,
      url: '/login',
      templateUrl: 'templates/home-login.html',
      controller: 'LoginCtrl'
    })

    .state('register', {
      cache: false,
      url: '/register',
      templateUrl: 'templates/home-register.html',
      controller: 'RegisterCtrl'
    })

    .state('tab', {
      cache: false,
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.login', {
      url: '/dash/login',
      views: {
        'tab-dash': {
          templateUrl: 'templates/home-login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('tab.register', {
      url: '/dash/register',
      views: {
        'tab-dash': {
          templateUrl: 'templates/home-register.html',
          controller: 'RegisterCtrl'
        }
      }
    })

    .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

    .state('tab.chat-detail', {
      url: '/chats/:username',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/home');

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');

});
