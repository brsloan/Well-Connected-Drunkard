angular.module('nightlifeCoordinator')
    .controller('MainCtrl', [
      '$scope',
      'auth',
      'home',
      'user',
      function($scope, auth, home, user){
        var formData = {};
        $scope.formData = formData;
        $scope.bars = home.bars;
        $scope.getBars = getBars;
        $scope.goToBar = home.addBar;
        $scope.cancelBar = home.cancelBar;
        
        $scope.isLoggedIn = auth.isLoggedIn;
        
        if(auth.isLoggedIn())
          user.getLocation(auth.currentUser(), home.getBars);
        
        function getBars(){
          home.getBars(formData.location);
        }
        
      }
    ])