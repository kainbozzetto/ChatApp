app.factory('Chats', 
	['FIREBASE_URL', 'FbArray', 'FbObject', function(FIREBASE_URL, FbArray, FbObject) {

		var Chats = function(dependencies, query) {
			if (!(this instanceof Chats)) {
				return new Chats(dependencies, query);
			}

			ref = new Firebase(FIREBASE_URL + '/chats');

			return FbArray.call(this, ref, dependencies, query);
		}

		Chats.prototype = Object.create(FbArray.prototype);

		angular.extend(Chats.prototype, {
			constructor: Chats
		});

		Chats.getCount = function() {
			var ref = new Firebase(FIREBASE_URL + '/chats_counter');

			return FbObject(ref);
		};

		return Chats;

	}]);