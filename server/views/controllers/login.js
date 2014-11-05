'user strict';
app.controller('LoginCtrl', function($scope, $location, $http, authService){

	$scope.loginData = {
		uname: "",
		pass: ""
	};

	$scope.message = "";

	$scope.login = function () {

        authService.login($scope.loginData).then(function (response) {
        	console.log(response);
        	if(response.Success == "True")
	            $location.path('/view1');
	        else
	        	$scope.message = response.Error;
        },
        function (error) {

        	console.log(status);

            $scope.message = "Error " + error.status + " (" + error.description + ")";
        });
    };

	// $scope.loginf = function(){
	// 	$scope.login.isAuth = true;
	// 	$location.path('/view1');
	// }




});