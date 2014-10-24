var sharedApp = angular.module('sharedApp', []);

sharedApp.factory('getTrips', function($log, $http) {

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

		// return trips;
});

sharedApp.controller('sharedCtrl', function($scope, getTrips){
	getTrips.loadTrips();
	$scope.shared = getTrips.allTrips();
});