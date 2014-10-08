'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/view1'});
}]).
controller('NavCtrl', function ($scope, $modal, $log) {

	$scope.open = function (size) {

	    var modalInstance = $modal.open({
	      templateUrl: 'find.html',
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
