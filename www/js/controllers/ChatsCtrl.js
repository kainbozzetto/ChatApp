app.controller('ChatsCtrl', function($scope, FbArray, Users) {
  $scope.users = Users();
});