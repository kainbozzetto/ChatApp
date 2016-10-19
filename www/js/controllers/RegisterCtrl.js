app.controller('RegisterCtrl', ['$scope', '$state', 'User', 'Auth', function($scope, $state, User, Auth) {
	$scope.register = function() {
		$scope.registering = true;

		Auth.$createUser({
			email: $scope.register.email,
			password: $scope.register.password
		})
		.then(function(auth) {
			return User(auth.uid).$loaded();
		})
		.then(function(newUser) {
			angular.extend(newUser, User.getTemplate(), {
				username: $scope.register.username,
				username_case_folded: $scope.register.username.toLowerCase()
			});
			return newUser.$save();
		})
		.then(function() {
			return User.incrementCounter();
		})
		.then(function() {
			return Auth.$authWithPassword({
				email: $scope.register.email,
				password: $scope.register.password
			});
		})
		.then(function() {
			$state.go('tab.chats');
		})
		.catch(function(error) {
			console.log('Error registering', error);
		})
		.finally(function() {
			$scope.registering = false;
		});
	}
}]);
