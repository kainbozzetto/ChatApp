app.controller('AccountCtrl', function($scope, $firebaseObject, User, FbArray, FbDependency) {
	var ref = $scope.currentUser.$ref();
	var settings = $firebaseObject(ref.child('settings'));
	settings.$bindTo($scope, 'settings');

	$scope.username = '';

	$scope.friends = FbArray(ref.child('friends'), FbDependency().$include('key()', function(id) { return { _user: User(id) }; }));


	$scope.addFriend = function() {
		User.findByUsername($scope.addFriend.username).then(function(friend) {
			if (friend) {
				console.log($scope.currentUser.addFriend(friend.$id));
			} else {
				// handle where username doesn't exist + if already a friend
			}
      $scope.addFriend.username = '';
		});
	};

	$scope.removeFriend = function(id) {
		$scope.currentUser.removeFriend(id);
	};
});