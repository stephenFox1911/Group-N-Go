'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, $http, $log) {

	$scope.trips = [];
	$log.info("loading trips");
	
	$http({
		method: 'GET',
		url: "http://www.corsproxy.com/groupngo.website/api/trips"
	})	
	.success(function(data){
		$log.info("got trips");
		$scope.trips = data;
		$log.info($scope.trips);
	})
	.error(function(data, status){
		$log.info(status);
	});
	
	
});