app.controller('HomeCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {
	if ($scope.currentUser) {
		$state.go('tab.dash');
	}

  $scope.logout = function() {
    Auth.$unauth();
  };
}]);