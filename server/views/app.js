'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
	'ngRoute',
	'myApp.version',
	'ui.bootstrap',
	'google-maps'.ns()
]).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
		controller: 'HomeCtrl',
		templateUrl: 'views/home.html'
	});
	$routeProvider.when("/login", {
		controller: 'LoginCtrl',
		templateUrl: 'views/login.html'
	});
	$routeProvider.when('/signup', {
		controller: 'SignupCtrl',
		templateUrl: 'views/signup.html'
	});
	$routeProvider.when('/view1', {
		controller: 'View1Ctrl',
		templateUrl: 'views/view1.html'
	});
	$routeProvider.when('/view2', {
		controller: 'View2Ctrl',
		templateUrl: 'views/view2.html'
	});
	$routeProvider.otherwise({redirectTo: 'home'});
}]).

controller('IndexCtrl', function ($scope, $modal, $log) {

	// getTrips.loadTrips();

	// $scope.trips = getTrips.allTrips();

	$scope.login = {};
	$scope.login.isAuth = false;
	$scope.login.userName = 'Buzz';

	$scope.logout = function() {
		$scope.login.isAuth = false;
		console.log($scope.login.isAuth);
		$location.path('/home');
	}

	$scope.open = function (size) {

	    var modalInstance = $modal.open({
	      templateUrl: 'views/find.html',
	      controller: 'ModalInstanceCtrl',
	      size: size,
	      resolve: {
	        items: function () {
	          return $scope.items;
	        }
	      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}).

controller('ModalInstanceCtrl', function ($scope, $modalInstance, $log, $http) {

	$scope.searchGroup = function() {
	
		$log.info("searching");
		$log.info($scope.slocation);
		$log.info($scope.elocation);
		
		var request = $http({
            method: 'POST',
            url: 'http://groupngo.website/api/trips',
			headers: {
			    'slocation': $scope.slocation,
			    'elocation': $scope.elocation
			}
        });
        
        request.success( function(data) {

        	$log.info('posted');
        	
        	$scope.data = data;
        	
        });
        
        request.error( function(data, status){
	       $log.info(status); 
        });
		
		$modalInstance.close();

	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});

app.factory('getTrips', function($log, $http) {

	var trips = [];

	return {
		loadTrips: function() {
			$log.info("getting trips...");
			$http({
				method: 'GET',
				url: "http://www.corsproxy.com/groupngo.website/api/trips"
			})	
			.success(function(data){
				trips = data;
				$log.info(trips);
			})
			.error(function(data, status){
				$log.info(status);
			});
		},

		allTrips: function() {
			return trips;
		}
	}
});

app.controller('loginCtrl', function($scope){

});
