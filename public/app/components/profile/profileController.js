angular.module('nightlifeCoordinator')
    .controller('ProfileCtrl', [
        '$scope',
        'user',
        'auth',
        'thisUser',
        function($scope, user, auth, thisUser){
            var formData = {};
            $scope.formData = formData;
            console.log(thisUser);
            $scope.user = thisUser;
            $scope.saveInfo = function(){
                user.saveProfileInfo(thisUser);
            };
            $scope.canEdit = auth.isLoggedIn && (auth.currentUser() == thisUser.username);
        }
    ]);