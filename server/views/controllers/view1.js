'use strict';

app.controller('View1Ctrl', function($scope, $http, $log, $modal, dataService, authService) {

	// $scope.trips = [];
	// // $log.info("loading trips");
	$scope.selected = {
		trip: {}
	};

	// $http({
	// 	method: 'GET',
	// 	url: "http://www.corsproxy.com/groupngo.website/api/trips"
	// })	
	// .success(function(data){
	// 	// $log.info("got trips");
	// 	$scope.trips = data;
	// 	$scope.selected = {
	// 		trip: $scope.trips[0]
	// 	};
	// 	// $log.info($scope.trips);
	// })
	// .error(function(data, status){
	// 	$log.info(status);
	// });

	// $scope.trips = dataService.getTrips();

	$scope.trips = [];
	$scope.service = dataService;


	dataService.getAllTrips().then(function(data){
		//$scope.trips = data;
		// console.log(dataService.getTrips());
		// $scope.trips = dataService.getTrips();

	});

	$scope.$watch('service.getTrips()', function(newVal, oldVal) {
		// console.log('new data coming in');
		// console.log(newVal);
		$scope.trips = newVal;
		// $scope.trips = dataService.getTrips();

	});

	$scope.popup = function () {

	    var modalInstance = $modal.open({
	      templateUrl: 'views/tripDetail.html',
	      controller: 'TripActionCtrl',
	      resolve: {
	        trip: function () {
	          return $scope.selected.trip;
	        }
	      }
    	});

		// console.log($scope.selectedTrip);

	    modalInstance.result.then(function () {

	    }, function () {
			$log.info('Modal dismissed at: ' + new Date());
	    });
	};

})

.controller('TripActionCtrl', function($scope, $modalInstance, trip, dataService, authService){

	$scope.trip = trip;
	$scope.members = [];
	$scope.actionString = "";

	$scope.authentication = authService.authentication;

	$scope.isInTrip = function() {
		
		console.log($scope.authentication.userName);

		if ($scope.captain != null)
			if ($scope.authentication.userName == $scope.captain.UserName) {
				// console.log($scope.captain.UserName);
				return true;
			}
		for (var i=0; i < $scope.members.length; i++) {
			// console.log($scope.authentication.userName);
			// console.log($scope.members[i].UserName);
			if ($scope.authentication.userName == $scope.members[i].UserName)
				return true;
		}
		return false;
	};

	$scope.loadTripMembers = function() {
		dataService.getTripDetail($scope.trip.ID).then(function(data){
			// console.log(data);
			$scope.captain = data[0];
			$scope.members = data;
			$scope.members.splice(0, 1);
			// console.log($scope.captain);
			// console.log($scope.members);
			console.log($scope.isInTrip());
			if ($scope.isInTrip())
				$scope.actionString = "Leave";
			else
				$scope.actionString = "Join";
		});
	};

	$scope.loadTripMembers();

	$scope.cancel = function () {
		dataService.getAllTrips();
		$modalInstance.dismiss('cancel');
	};

	$scope.joinleave = function () {
		// console.log($scope.members.length);
		if (!$scope.isInTrip())
			dataService.joinTrip($scope.trip.ID).then(function(data){
				// console.log(data);
				$scope.loadTripMembers();
			});
		else
			dataService.leaveTrip($scope.trip.ID).then(function(data){
				$scope.loadTripMembers();
			});
	};

	// $scope.leave = function () {
	// 	// console.log($scope.members.length);
	// 	dataService.leaveTrip($scope.trip.ID).then(function(data){
	// 		$scope.loadTripMembers();
	// 	});
	// };

});