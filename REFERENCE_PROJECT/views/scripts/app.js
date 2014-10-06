var app = angular.module('crowdComp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/index',
            {
                controller: 'loginController',
                templateUrl: 'views/login.html'
            })
        //Home after successful login
        .when('/home',
            {
                controller: 'homeController',
                templateUrl: 'views/home.html'
            })
        .otherwise({ redirectTo: '/index' });
});