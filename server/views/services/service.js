"use strict";

app.factory('dataService', function($http, $q, ngAuthSettings){

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var dataServiceFactory = {};

	var trips = [];

	var _getCloseTrips = function(location){

		var request = $http({
			method: 'GET',
			url: serviceBase + '/api/close?slocation=' + location
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
	}

	dataServiceFactory.getAllTrips = _getAllTrips;
	dataServiceFactory.getCloseTrips = _getCloseTrips;
	dataServiceFactory.getTrips = _trips;

	return dataServiceFactory;

})