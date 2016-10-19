app.factory('Auth',
	['FIREBASE_URL', '$firebaseAuth', function(FIREBASE_URL, $firebaseAuth) {

		var ref = new Firebase(FIREBASE_URL);

		return $firebaseAuth(ref);

	}]);