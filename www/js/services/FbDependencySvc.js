app.factory('FbDependency', 
	[function() {
		function FbDependency() {
			if (!(this instanceof FbDependency)) {
				return new FbDependency();
			}
			this.$list = [];

			this.$list['$include'] = function(key, callback) {
				this.$list.push({key: key, callback: callback});
				return this.$list;
			}.bind(this);

			return this.$list;
		}

		FbDependency.prototype = {
			constructor: FbDependency
		};

		return FbDependency;
	}]);