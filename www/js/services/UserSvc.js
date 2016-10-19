app.factory('User',
	['FIREBASE_URL', 'FbObject', '$q', function(FIREBASE_URL, FbObject, $q) {

		var User = function(id, dependencies) {
			if (!(this instanceof User)) {
				return new User(id, dependencies);
			}

			this.$userRef = new Firebase(FIREBASE_URL + '/users/' + id);

			FbObject.call(this, this.$userRef, dependencies);
		}

		User.prototype = Object.create(FbObject.prototype);

		angular.extend(User.prototype, {
			constructor: User,

			addFriend: function(friendId) {
				var friend = FbObject(this.$userRef.child('friends/' + friendId));
				return friend.$loaded().then(function() {
					friend.$value = true;
					return friend.$save();
				});
			},

			removeFriend: function(friendId) {
				var friend = FbObject(this.$userRef.child('friends/' + friendId));

				return friend.$remove();
			},

			setLastOnline: function() {
				this.$userRef.child('lastOnline').set(Firebase.ServerValue.TIMESTAMP);
			},
			

			setLastOnlineOnDisconnect: function() {
				this.$userRef.child('lastOnline').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
			},

			removeLastOnlineOnDisconnect: function() {
				this.$userRef.child('lastOnline').onDisconnect().cancel();
			}
		});

		User.getTemplate = function() {
			return {
				username: null,
				username_case_folded: null,
				dateCreated: Firebase.ServerValue.TIMESTAMP,
				lastOnline: Firebase.ServerValue.TIMESTAMP,
				settings: {
					receiveFriendChatOnly: false,
				},
				friends: null
			};
		}

		User.findByUsername = function(username, dependencies) {
			var d = $q.defer();

			var ref = new Firebase(FIREBASE_URL + '/users');

			ref.orderByChild('username_case_folded').equalTo(username.toLowerCase()).once('value', function(snap) {
				if(!snap.val()) {
					d.reject('INVALID_USERNAME');
				} else {
					var user = User(Object.keys(snap.val())[0], dependencies);
				
					d.resolve(user);
				}
			});

			return d.promise;
		}

		User.incrementCounter = function() {
			var ref = new Firebase(FIREBASE_URL + '/users_counter');

			ref.transaction(function(value) {
				return (value || 0) + 1;
			});
		};

		return User;

	}]);