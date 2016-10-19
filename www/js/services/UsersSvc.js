app.factory('Users', 
	['FIREBASE_URL', 'FbArray', 'FbObject', function(FIREBASE_URL, FbArray, FbObject) {

		var Users = function(dependencies, query) {
			if (!(this instanceof Users)) {
				return new Users(dependencies, query);
			}

			ref = new Firebase(FIREBASE_URL + '/users');

			return FbArray.call(this, ref, dependencies, query);
		}

		Users.prototype = Object.create(FbArray.prototype);

		angular.extend(Users.prototype, {
			constructor: Users
		});

		Users.getCount = function() {
			var ref = new Firebase(FIREBASE_URL + '/users_counter');

			return FbObject(ref);
		};

		return Users;

	}]);


/*

if (query) {
	var ref = new Firebase(FIREBASE_URL + '/users');
	var pageRef = new Firebase.util.Paginate(ref, query.field, {pageSize: query.pageSize});

	var list = FbArray.call(this, pageRef, dependencies);
	list.page = pageRef.page;

	pageRef.page.onPageCount(function(currentPageCount, couldHaveMore) {
		list.pageCount = currentPageCount;
		list.couldHaveMore = couldHaveMore;
	});

	pageRef.page.onPageChange(function(currentPageNumber) {
		list.currentPageNumber = currentPageNumber;
	});

	pageRef.page.next();

	return list;
} else {
	ref = new Firebase(FIREBASE_URL + '/users').orderByChild('battletag');

	return FbArray.call(this, ref, dependencies);
}

*/
