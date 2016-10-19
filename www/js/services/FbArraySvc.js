app.factory('FbArray',
	['$firebaseArray', '$q', function($firebaseArray, $q) {

		var FbArray = function (ref, dependencies, query) {
			if (!(this instanceof FbArray)) {
				return new FbArray(ref, dependencies, query);
			}

			this.$$settings = {
				promises: [],
				dependencies: dependencies || []
			};

			if (query) {
				for (var key in query) {
					if (ref[key] !== undefined && typeof ref[key] === 'function') {
						ref = ref[key](query[key]);
					}
				}
			}
			
			return $firebaseArray.call(this, ref);
		};

		FbArray.prototype = Object.create($firebaseArray.prototype);

		angular.extend(FbArray.prototype, {
			constructor: FbArray,

			$include: function(key, callback) {
				this.$$settings.dependencies.push({key: key, callback: callback});
				return this.$list; // this is what the $firebaseArray constructor returns, allows for $include chaining
			},

			// the promise for loading is met after the first $$added promise is resolved - need to change it so this happens once all the $$added's finished loading
			$$added: function(snapshot, prevChildKey) {
				var added = $firebaseArray.prototype.$$added.apply(this, arguments);

				var val = snapshot.val();
				// the dependencies aren't set by the time $$added runs if the data is already downloaded
				if (val) {
					var promises = this.$$settings.dependencies.map(function (dependency) {
						if (dependency.key === 'key()') {
							var dependencyObj = dependency.callback(snapshot.key());
							angular.extend(added, dependencyObj);
							dependencyObjPromises = Object.keys(dependencyObj).map(function (key) {
								// currently refering to dependencyObj - perhaps need to refer to added?
								return dependencyObj[key].$loaded().catch(angular.noop);
							});
							return $q.all(dependencyObjPromises);
						} else {
							var new_id = val[dependency.key];
							var instance_key = '_' + dependency.key;

							if (new_id) {
								if (!added[instance_key]) {
									added[instance_key] = dependency.callback(new_id);
								}
								return added[instance_key].$loaded().catch(angular.noop);
							}

							return null;
						}
					}, this).filter(function (promise) {
						return promise !== null;
					});

					var promise = $q.all(promises)
						.finally(function() {
							this.$$settings.promises.splice(this.$$settings.promises.indexOf(promise), 1);
						}.bind(this));

					if (promises.length) {
						this.$$settings.promises.push(promise);
					}
				}

				return added;
			},

			$$updated: function(snapshot) {
				//console.log('$$updated')
				var val = snapshot.val();

				if (val) {
					this.$$settings.dependencies.forEach(function (dependency) {
						if (dependency.key === 'key()') {
							//console.log('FbArray->$$updated where key = key()');
						} else {
							var old_id = this.$getRecord(snapshot.key())[dependency.key];
							var new_id = val[dependency.key];

							if (old_id !== new_id) {
								var instance_key = '_' + dependency.key;

								if (this.$getRecord(snapshot.key())[instance_key]) {
									if(!new_id || this.$getRecord(snapshot.key())[instance_key].$id !== new_id) { // dunno about this?
										// destroy old instance
										// this.$getRecord(snapshot.key())[instance_key].$destroy(); // necessary?
										delete this.$getRecord(snapshot.key())[instance_key];
									}
								}

								if (new_id) {
									if (!this.$getRecord(snapshot.key())[instance_key]) {
										this.$getRecord(snapshot.key())[instance_key] = dependency.callback(new_id);
									}
								}
							}
						}
					}, this);
				}

				return $firebaseArray.prototype.$$updated.apply(this, arguments);
			},

			$loaded: function() {
				var loaded = $firebaseArray.prototype.$loaded.apply(this, arguments);

				return loaded.then(function(val) {
					if (this.$$settings.promises.length) {
						return $q.all(this.$$settings.promises).then(function() {
							return val;
						});
					}
					return val;
				}.bind(this));
			},

			$getSettings: function() {
				return this.$$settings;
			}
		});

		return FbArray;
		
	}]);