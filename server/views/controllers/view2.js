'use strict';

app.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
    GoogleMapApi.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}])

.controller('View2Ctrl', ['$scope', 'GoogleMapApi'.ns(), '$log', '$http', 'dataService', function($scope, GoogleMapApi, $log, $http, dataService) {
	
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

    // $scope.trips = [];
	
	// $scope.testtrips = [{
	// 	ID: 0,
	// 	slocation: {
	// 		coords: {
	//         latitude:33.777420,
	//         longitude:-84.397850				
	// 		}

	// 	}
	// },
	// {
	// 	ID: 1,
	// 	slocation: {
	// 		coords: {
	//         latitude:33.777520,
	//         longitude:-84.397970				
	// 		}

	// 	}
	// }];

	// $http({
	// 	method: 'GET',
	// 	url: "http://www.corsproxy.com/groupngo.website/api/trips"
	// })	
	// .success(function(data){

	// 	$scope.trips = data;

	// 	$log.info(data);

	// })
	// .error(function(data, status){
	// 	$log.info(status);
	// });

	$scope.trips = [];

	$scope.service = dataService;

	dataService.getAllTrips().then(function(data){
		// $scope.trips = data;
	});

	$scope.$watch('service.getTrips()', function(newVal, oldVal) {
		// console.log('new data coming in');
		// console.log(newVal);
		$scope.trips = newVal;
		// $scope.trips = dataService.getTrips();

	});

}]);
