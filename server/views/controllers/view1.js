'use strict';

app.controller('View1Ctrl', function($scope, $http, $log, $modal) {

	$scope.trips = [];
	// $log.info("loading trips");
	$scope.selected = {
		trip: {}
	};

	$http({
		method: 'GET',
		url: "http://www.corsproxy.com/groupngo.website/api/trips"
	})	
	.success(function(data){
		// $log.info("got trips");
		$scope.trips = data;
		$scope.selected = {
			trip: $scope.trips[0]
		};
		// $log.info($scope.trips);
	})
	.error(function(data, status){
		$log.info(status);
	});

	$scope.popup = function () {

	    var modalInstance = $modal.open({
	      templateUrl: 'views/tripDetail.html',
	      controller: 'TripActionCtrl',
	      size: 'small',
	      resolve: {
	        trip: function () {
	          return $scope.selected.trip;
	        }
	      }
    	});

		console.log($scope.selectedTrip);

	    modalInstance.result.then(function () {

	    }, function () {
			$log.info('Modal dismissed at: ' + new Date());
	    });
	};

})

.controller('TripActionCtrl', function($scope, $modalInstance, trip){
	$scope.trip = trip;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});