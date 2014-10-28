'user strict';
app.controller('LoginCtrl', function($scope, $location, $http, authService){

	$scope.loginData = {
		uname: "",
		pass: ""
	};

	$scope.message = "";

	$scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/view1');

        },
        function (err) {
            $scope.message = err.error_description;
        });
    };

	// $scope.loginf = function(){
	// 	$scope.login.isAuth = true;
	// 	$location.path('/view1');
	// }




});