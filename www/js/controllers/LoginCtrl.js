app.controller('LoginCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {
	$scope.loggingIn = false;

	$scope.login = function() {
		$scope.loggingIn = true;

		Auth.$authWithPassword({
			email: $scope.login.email,
			password: $scope.login.password
		}).then(function(auth) {
			console.log('Logged in as: ' + auth.uid);
			$scope.loginErrorMessage = null;
			$state.go('tab.chats');
		}).catch(function(error) {
			console.log('Error logging in: ', error);
			$scope.loginErrorMessage = 'Wrong email address or password.';
		}).finally(function() {
			$scope.loggingIn = false;
			$scope.login.password = '';
		});
	};
}]);