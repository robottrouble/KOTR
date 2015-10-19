// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('kotr', ['ionic'])

.controller('ChecklistCtrl', function($scope, $ionicModal) {
    $scope.checklists = [
        { title: 'Woodward 2016' },
        { title: 'Woodward 2015' }
    ];

// Create and load the Modal
    $ionicModal.fromTemplateUrl('/partials/new-checklist.html', function(modal) {
        $scope.checklistModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Called when the form is submitted
  $scope.creatChecklist = function(checklists) {
    $scope.checklists.push({
      title: checklist.title
    });
    $scope.checklistModal.hide();
    checklist.title = "";
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
