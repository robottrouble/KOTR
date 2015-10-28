// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var kotr = angular.module("kotr", ["ionic", "firebase", "ngCordovaOauth"])

function getName(authData) {
  switch(authData.provider) {
       case 'password':
         return authData.password.email.replace(/@.*/, '');
       case 'twitter':
         return authData.twitter.displayName;
       case 'facebook':
         return authData.facebook.displayName;
  }
}

kotr.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
  $ionicConfigProvider.tabs.position('bottom')
  $stateProvider
  .state('main', {
    url: "/main",
    abstract: true,
    templateUrl: "main.html"
  })

  .state('main.tabs', {
    url: "/tab",
    abstract: true,
    views: {
      'main': {
        templateUrl: "tabs.html",
        controller: 'ChecklistCtrl'
      }
    }
  })
  .state('main.tabs.checkitems', {
    url: "/checkitems",
    views: {
      'checkitems-tab': {
        templateUrl: "checklist.html"
      }
    }
  })
.state('main.tabs.checklists', {
    url: "/checklists",
    views: {
      'checklists-tab': {
        templateUrl: "checklists.html"
      }
    }
  })
  .state('main.tabs.teams', {
      url: "/teams",
      views: {
        'teams-tab': {
          templateUrl: "teams.html"
        }
      }
    })
  .state('main.tabs.activity', {
    url: "/activity",
    views: {
      'activity-tab': {
        templateUrl: "activity.html"
      }
    }
  })
  .state('main.tabs.editChecklist', {
      url: "/checklist/:checklistId",
      views: {
        'checklists-tab': {
          templateUrl: "checklist_edit.html"
        }
      },
  })

  $urlRouterProvider.otherwise("/main/tab/activity");
})


.factory("Checklists", function($firebaseArray) {
  var itemsRef = new Firebase("https://brilliant-torch-531.firebaseio.com/checklists");
  return $firebaseArray(itemsRef);
})

.factory("Teams", function($firebaseArray) {
  var itemsRef = new Firebase("https://brilliant-torch-531.firebaseio.com/teams");
  return $firebaseArray(itemsRef);
})

.factory("Users", function($firebaseArray) {
  var usersRef = new Firebase("https://brilliant-torch-531.firebaseio.com/users");
  return $firebaseArray(usersRef);
})

.factory("UserDetails", function($firebaseArray) {
  var usersRef = new Firebase("https://brilliant-torch-531.firebaseio.com/userdetails");
  return $firebaseArray(usersRef);
})

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://brilliant-torch-531.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})

.controller('TeamCtrl', function($scope, $ionicModal, Teams, Users, Auth, Checklists) {
  $scope.teams = Teams;
  $scope.users = Users;
  $scope.checklists = Checklists;

  $ionicModal.fromTemplateUrl('partials/new-team.html', function(modal) {
    $scope.teamModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.newTeam = function() {
    $scope.teamModal.show();
  }

  $scope.addUserToTeam = function(user, team) {
    if ($scope.teamMembers === null || $scope.teamMembers === undefined)
      $scope.teamMembers = []
    $scope.teamMembers.push(user);
    team.search="";
  }

  $scope.createTeam = function(user, team) {
    console.log("user: " + user)
    $scope.teams.$add({
      name: team.name,
      owner: user.$id,
      checklist: team.checklist
    }).then(function(ref) {

      if (user.teams === null || user.teams === undefined)
        user.teams = []

      user.teams.push(ref.key());
      Users.$save(user);
    });

    $scope.teamModal.hide();
    team.name = "";
  }

  $scope.closeNewTeam = function() {
    $scope.teamModal.hide();
    team.name = "";
  }
})

.controller('ChecklistCtrl', function($scope, $ionicModal, $stateParams, Checklists, Users) {
  $scope.checklists = Checklists;
  $scope.users = Users;
  $scope.checklistId = $stateParams.checklistId;
  $scope.selectedChecklist = null;

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('partials/new-checklist.html', function(modal) {
    $scope.checklistModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicModal.fromTemplateUrl('partials/new-checklist-item-group.html', function(modal) {
    $scope.checklistItemGroupModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicModal.fromTemplateUrl('partials/new-checklist-item.html', function(modal) {
    $scope.checklistItemModal = modal;
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

  $scope.createChecklistItem = function(checklistId, groupId, checklistItem) {
    var cl = Checklists[checklistId];
    if (cl.itemGroups[groupId].items === null || cl.itemGroups[groupId].items === undefined)
      cl.itemGroups[groupId].items = [];

    cl.itemGroups[groupId].items.push(checklistItem);
    Checklists.$save(cl);
    $scope.groupId = null;
    $scope.checklistItemModal.hide();
    checklistItem.title = "";
    checklistItem.description = "";
  };
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.createChecklistItemGroup = function(checklistId, checklistGroup) {
    var cl = Checklists[checklistId];
    if (cl.itemGroups === null || cl.itemGroups === undefined)
      cl.itemGroups = [];
    cl.itemGroups.push(checklistGroup);
    Checklists.$save(cl);
    $scope.checklistItemGroupModal.hide();
    checklistGroup.title = "";
  }

  // Open our new checklist modal
  $scope.newChecklist = function() {
    $scope.checklistModal.show();
  };

  // Close the new checklist modal
  $scope.closeNewChecklist = function() {
    $scope.checklistModal.hide();
  };

  $scope.newChecklistItem = function(groupId) {
    $scope.groupId = groupId;
    $scope.checklistItemModal.show();
  };

  $scope.closeNewChecklistItem = function() {
    $scope.groupId = null;
    $scope.checklistItemModal.hide();
  };

  $scope.newChecklistItemGroup = function() {
    $scope.checklistItemGroupModal.show();
  };

  $scope.closeNewChecklistItemGroup = function() {
    $scope.checklistItemGroupModal.hide();
  };

})

.controller('LoginCtrl', function($scope, $ionicModal, Auth, Users, $cordovaOauth, $ionicSideMenuDelegate) {
  var ref = new Firebase("https://brilliant-torch-531.firebaseio.com");
  $scope.users = Users;
  $scope.user = null;

  $scope.login = function() {
    console.log("login");
    Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
    console.log("logged in");
      // User successfully logged in
    }).catch(function(error) {
      console.log("error");
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        $cordovaOauth.facebook("704293916339415", ["email"]).then(function(result) {
            Auth.$authWithOAuthToken("facebook", result.access_token).then(function(authData) {
                console.log(JSON.stringify(authData));
            }, function(error) {
                console.error("ERROR: " + error);
            });
        }, function(error) {
            console.log("ERROR: " + error);
        });
      } else {
        // Another error occurred
        console.log(error);
      }
    });
    console.log("login() done");
  };

  $scope.logout = function() {
    Auth.$unauth();
  };

  var onAuthCallback = function(authData) {
    if (authData === null) {
      console.log("Not logged in yet");
    } else {
      $scope.users.$loaded().then(function() {
        if (Users.$getRecord(authData.uid) === null) {
          ref.child("users").child(authData.uid).set({
            provider: authData.provider,
            name: getName(authData)
          });
        }
        $scope.user = Users.$getRecord(authData.uid);
      });
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
