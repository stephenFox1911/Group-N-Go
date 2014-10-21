'use strict';

angular.module('myApp.view2', [
	'ngRoute',
	'google-maps'.ns()
])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/view2', {
		templateUrl: 'view2/view2.html',
		controller: 'View2Ctrl'
	});

}])

.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
    GoogleMapApi.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}])

.controller('View2Ctrl', ['$scope', 'GoogleMapApi'.ns(), '$log', '$http', 'getTrips', function($scope, GoogleMapApi, $log, $http, getTrips) {
	$scope.map = {
	    center: {
	        latitude:33.777420,
	        longitude:-84.397850
	    },
	    zoom:16
	};

    GoogleMapApi.then(function(maps) {
    	$log.info("google maps is ready");
    });

    $scope.trips = [];
	
	$scope.testtrips = [{
		ID: 0,
		slocation: {
			coords: {
	        latitude:33.777420,
	        longitude:-84.397850				
			}

		}
	},
	{
		ID: 1,
		slocation: {
			coords: {
	        latitude:33.777520,
	        longitude:-84.397970				
			}

		}
	}];

	$http({
		method: 'GET',
		url: "http://www.corsproxy.com/groupngo.website/api/trips"
	})	
	.success(function(data){
		// $log.info("got trips");

		$scope.trips = data;

		// for (var i=0; i < $scope.trips.length; i++){
		// 	$scope.trips[i].coords = {
		// 		latitude: $scope.trips[i].slocation.coords.latitue,
		// 		longitude: $scope.trips[i].slocation.coords.longitude
		// 	}
		// 	console.log($scope.trips[i].coords);
		// }

		$log.info(data);

	})
	.error(function(data, status){
		$log.info(status);
	});

}]);
