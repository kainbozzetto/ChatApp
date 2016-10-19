app.factory('FbObject',
	['$firebaseObject', '$q', function($firebaseObject, $q) {

		var FbObject = function (ref, dependencies) {
			if (!(this instanceof FbObject)) {
				return new FbObject(ref, dependencies);
			}

            this.$$settings = {
				promise: null,
				dependencies: dependencies || []
			};

			$firebaseObject.call(this, ref);
		};

		FbObject.prototype = Object.create($firebaseObject.prototype);

		angular.extend(FbObject.prototype, {
			constructor: FbObject,

			$include: function(key, callback) {
				this.$$settings.dependencies.push({key: key, callback: callback});
				return this;
			},

			$$updated: function(snapshot) {
				var val = snapshot.val();

				if (val) {
					var promises = this.$$settings.dependencies.map(function (dependency) {
						if (dependency.key === 'key()') {
							var dependencyObj = dependency.callback(snapshot.key());
							angular.extend(this, dependencyObj);
							dependencyObjPromises = Object.keys(dependencyObj).map(function (key) {
								// currently refering to dependencyObj - perhaps need to refer to added?
								return dependencyObj[key].$loaded().catch(angular.noop);
							});
							return $q.all(dependencyObjPromises);
						} else {
							var old_id = this[dependency.key];
							var new_id = val[dependency.key];

							if (old_id !== new_id) {
								//console.log('Updating ' + dependency.key);
								var instance_key = '_' + dependency.key;

								if (this[instance_key]) {
									if (!new_id || this[instance_key].$id !== new_id) { // should this be new_id.$id? what if the dependency is a FbArray (i.e. doesn't have an $id)?
										// destroy old instance
										// this[instance_key].$destroy(); // necessary?
										delete this[instance_key];
									}
								}

								if (new_id) {
									if (!this[instance_key]) {
										this[instance_key] = dependency.callback(new_id);
									}
									return this[instance_key].$loaded().catch(angular.noop);
								}
							}

							return null;
						}
					}, this).filter(function (promise) {
						return promise !== null;
					});

					if (promises.length) {
						this.$$settings.promise = $q.all(promises).finally(function () {
							this.$$settings.promise = null;
						}.bind(this));
					}
				}

				return $firebaseObject.prototype.$$updated.apply(this, arguments);
			},

			$loaded: function() {
				var loaded = $firebaseObject.prototype.$loaded.apply(this, arguments);

				return loaded.then(function(val) {
					if (this.$$settings.promise) {
						return this.$$settings.promise.then(function() {
							return val;
						});
					}
					return val;
				}.bind(this));
			}
		});

		return FbObject;
		
	}]);