"use strict";

app.factory('dataService', ['$http', '$q', 'ngAuthSettings', 'localStorageService', function($http, $q, ngAuthSettings, localStorageSerivce){

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var dataServiceFactory = {};

	var trips = [];

	var _getCloseTrips = function(location){

		var request = $http({
			method: 'GET',
			url: serviceBase + '/api/close?slocation=' + location,
			// headers: {test: 'a'}
			headers: localStorageSerivce.get('authorizationData')
		});

        var deferred = $q.defer();

		request.success(function(data){

			trips = data;
			// console.log(trips);
			deferred.resolve(trips);

		})
		.error(function(error, status){
            deferred.reject(err);
		});

		return deferred.promise;

	};

	var _getAllTrips = function(){

		var request = $http({
			method: 'GET',
			url: serviceBase + '/api/trips',
			headers: localStorageSerivce.get('authorizationData')
		});

        var deferred = $q.defer();

		request.success(function(data){

			trips = data;
			// console.log(trips);
			deferred.resolve(trips);

		})
		.error(function(error, status){
            deferred.reject(err);
		});

		return deferred.promise;

	};

	var _trips = function() {
		return trips;
	};

	var _getTripDetail = function(id){
		var request = $http({
			method: 'GET',
			url: serviceBase + '/api/trips/' + id,
			headers: localStorageSerivce.get('authorizationData')
		});

        var deferred = $q.defer();

		request.success(function(data){

			
			// console.log(trips);
			deferred.resolve(data);

		})
		.error(function(error, status){
            deferred.reject(err);
		});

		return deferred.promise;

	};

	var _joinTrip = function(id){
		var request = $http({
			method: 'POST',
			url: serviceBase + '/api/trips/' + id,
			headers: localStorageSerivce.get('authorizationData')
		});

		request.success(function(data){
			console.log(data);
		})
		.error(function(error, status){
			console.log(error);
		});
	};

	var _leaveTrip = function(id){
		var request = $http({
			method: 'DELETE',
			url: serviceBase + '/api/trips/' + id,
			headers: localStorageSerivce.get('authorizationData')
		});

		request.success(function(data){
			console.log(data);
		})
		.error(function(error, status){
			console.log(error);
		});
	};

	dataServiceFactory.getAllTrips = _getAllTrips;
	dataServiceFactory.getCloseTrips = _getCloseTrips;
	dataServiceFactory.getTripDetail = _getTripDetail;
	dataServiceFactory.joinTrip = _joinTrip;
	dataServiceFactory.leaveTrip = _leaveTrip;
	
	dataServiceFactory.getTrips = _trips;

	return dataServiceFactory;

}]);