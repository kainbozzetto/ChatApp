app.controller('ChatDetailCtrl', function($scope, $stateParams, FbObject, User, Chats, Messages, FbDependency, $ionicScrollDelegate, $cordovaCamera) {
  $scope.username = $stateParams.username;

  var chatID;

  User.findByUsername($stateParams.username).then(function(user) {
    $scope.otherUser = user;

  	var ref = $scope.currentUser.$ref().child('chats/' + user.$id);

  	FbObject(ref).$loaded().then(function(chat) {
  		if (!chat.$value) {
        var chatData = {
          users: {}
        };

        chatData.users[$scope.currentUser.$id] = true;
        chatData.users[user.$id] = true;

  			Chats().$add(chatData).then(function(chatRef) {
          chatID = chatRef.key();
          ref.set(chatID);
          var otherUserRef = user.$ref().child('chats/' + $scope.currentUser.$id);
          otherUserRef.set(chatID);
          loadMessages(chatID);
        });
  		} else {
        chatID = chat.$value;
        loadMessages(chatID);
      }
  	});
  });

  

  function loadMessages(chatID) {
    var added = Messages.prototype.$$added;
    Messages.prototype.$$added = function(snapshot, prevChildKey) {
      var _added = added.apply(this, arguments);
      $ionicScrollDelegate.scrollBottom();

      return _added;
    };

    Messages(chatID, FbDependency().$include('from', function(from) { return User(from); })).$loaded().then(function(messages) {
      $scope.messages = messages;
      $ionicScrollDelegate.scrollBottom();
    });  
  }

  $scope.sendMessage = function() {
    $scope.messages.$add({
      data: $scope.message,
      type: 'text',
      from: $scope.currentUser.$id,
      dateSent: Firebase.ServerValue.TIMESTAMP
    }).then(function() {
      $ionicScrollDelegate.scrollBottom();
    });

    $scope.message = '';
  };

  $scope.sendPhoto = function() {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log(imageData);
      $scope.messages.$add({
        data: imageData,
        type: 'image',
        from: $scope.currentUser.$id,
        dateSent: Firebase.ServerValue.TIMESTAMP
      }).then(function() {
        $ionicScrollDelegate.scrollBottom();
      });
    }, function(err) {
      // error
      console.log('camera error:', err);
    });
  }
});