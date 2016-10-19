app.controller('DashCtrl', function($scope, $state, Auth, FbObject) {
	var ref = new Firebase('https://shining-inferno-3102.firebaseio.com/.info/connected');
	FbObject(ref).$loaded().then(function(data) {
		$scope.connected = data;
	});

  $scope.logout = function() {
    Auth.$unauth();
  };
});