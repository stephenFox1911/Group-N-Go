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

.controller('View2Ctrl', ['$scope', 'GoogleMapApi'.ns(), '$log', function($scope, GoogleMapApi, $log) {
	$scope.map = {
	    center: {
	        latitude: 45,
	        longitude: -73
	    },
	    zoom: 8
	};
    GoogleMapApi.then(function(maps) {
    	$log.info("google maps is ready");
    });
}]);