// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module("kotr", ["ionic", "firebase"])

.factory("Checklists", function($firebaseArray) {
  var itemsRef = new Firebase("https://brilliant-torch-531.firebaseio.com/checklists");
  return $firebaseArray(itemsRef);
})

.factory("Teams", function($firebaseArray) {
  var itemsRef = new Firebase("https://brilliant-torch-531.firebaseio.com/teams");
  return $firebaseArray(itemsRef);
})

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://brilliant-torch-531.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})
// https://auth.firebase.com/v2/brilliant-torch-531/auth/facebook/callback

.controller('TeamCtrl', function($scope, $ionicModal, Teams, Auth) {
  $scope.teams = Teams;

  $ionicModal.fromTemplateUrl('partials/new-team.html', function(modal) {
    $scope.teamModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.newTeam = function() {
    $scope.teamModal.show();
  }

  $scope.createTeam = function(team) {
    $scope.teams.$add({
      name: team.name
    });
    $scope.teamModal.hide();
    team.name = "";
  }

  $scope.closeNewTeam = function() {
    $scope.teamModal.hide();
    team.name = "";
  }
})

.controller('ChecklistCtrl', function($scope, $ionicModal, Checklists, Auth) {


  $scope.checklists = Checklists;

  $scope.selectedChecklist = null;

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('partials/new-checklist.html', function(modal) {
    $scope.checklistModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicModal.fromTemplateUrl('partials/select-checklist.html', function(modal) {
    $scope.selectChecklistModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.selectChecklist = function() {
    $scope.selectChecklistModal.show();
  }

  $scope.setCurrentChecklist = function(checklist) {
    $scope.selectedChecklist = checklist;
    $scope.selectedChecklist.title = checklist.title;
    $scope.selectChecklistModal.hide();
  }

  // Called when the form is submitted
  $scope.createChecklist = function(checklist) {
    $scope.checklists.$add({
      title: checklist.title,
      description: checklist.description
    });
    $scope.checklistModal.hide();
    checklist.title = "";
    checklist.description = "";
  };

  // Open our new checklist modal
  $scope.newChecklist = function() {
    $scope.checklistModal.show();
  };

  // Close the new checklist modal
  $scope.closeNewChecklist = function() {
    $scope.checklistModal.hide();
  };
})

.controller('LoginCtrl', function($scope, $ionicModal, Checklists, Auth) {
  $scope.login = function() {
  //  alert("login");
    Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
    //  alert("logged in");
      // User successfully logged in
    }).catch(function(error) {
  //    alert("error");
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        alert("popup");
        Auth.$authWithOAuthPopup("facebook").then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          console.log(authData);
          alert(authData);
        });
      } else {
    //    alert("error2");
        // Another error occurred
        console.log(error);
      }
    });
  //  alert("done");
  };

  $scope.logout = function() {
    Auth.$unauth();
  };

  var onAuthCallback = function(authData) {
    if (authData === null) {
      console.log("Not logged in yet");
    } else {
      console.log("Logged in as", authData.uid);
    }
    $scope.authData = authData; // This will display the user's name in our view
  };

  setTimeout(function() { Auth.$onAuth(onAuthCallback); }, 1200);

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
