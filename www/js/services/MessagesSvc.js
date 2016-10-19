app.factory('Messages', 
	['FIREBASE_URL', 'FbArray', 'FbObject', function(FIREBASE_URL, FbArray, FbObject) {

		var Messages = function(id, dependencies, query) {
			if (!(this instanceof Messages)) {
				return new Messages(id, dependencies, query);
			}

			ref = new Firebase(FIREBASE_URL + '/chats/' + id + '/messages');

			return FbArray.call(this, ref, dependencies, query);
		}

		Messages.prototype = Object.create(FbArray.prototype);

		angular.extend(Messages.prototype, {
			constructor: Messages
		});

		Messages.getCount = function() {
			var ref = new Firebase(FIREBASE_URL + '/chats/' + id + '/messages_counter');

			return FbObject(ref);
		};

		return Messages;

	}]);