'user strict';
app.controller('LoginCtrl', function($scope, $location){
	console.log("login");
	$scope.loginf = function(){
		$scope.login.isAuth = true;
		$location.path('/view1');
	}

});