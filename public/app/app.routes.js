angular.module('nightlifeCoordinator')
    .config([
      '$stateProvider',
      '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider){
        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: 'app/components/home/homeView.html',
            controller: 'MainCtrl'
        })
          .state('login',{
            url: '/login',
            templateUrl: '/app/components/login/loginView.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
              if(auth.isLoggedIn()){
                $state.go('home');
              }
            }]
          })
          .state('register', {
            url: '/register',
            templateUrl: '/app/components/register/registerView.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
              if(auth.isLoggedIn()){
                $state.go('home');
              }
            }]
          })
    
        $urlRouterProvider.otherwise('home');
    }]);