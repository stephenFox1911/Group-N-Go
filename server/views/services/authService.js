'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$cookies', '$timeout', function ($http, $q, localStorageService, ngAuthSettings, $cookies, $timeout) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        // useRefreshTokens: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    var _saveRegistration = function (registration) {

        _logOut();

        console.log(serviceBase + '/api/users');

        var request = $http({
            method: 'POST',
            url: serviceBase + '/api/users',
            headers: registration
        });

        return request.then(function(response) {
            return response;
        });
        // return $http.post(serviceBase + '/api/users', registration).then(function (response) {
        //     return response;
        // });

    };

    var _login = function (loginData) {

        // var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        // if (loginData.useRefreshTokens) {
        //     data = data + "&client_id=" + ngAuthSettings.clientId;
        // }
        loginData['Access-Control-Allow-Credentials'] = true;
        loginData['Access-Control-Allow-Origin'] = true;

        console.log(loginData);
        var request = $http({
            url: serviceBase + '/api/login',
            method: 'POST',
            headers: loginData,
            // withCredentials: true
        });

        var deferred = $q.defer();

        request.success(function(data, status, headers, config){
            // console.log(data);

            if (data["Success"] == "True") {

                localStorageService.set('authorizationData', {cuc: headers()['cuc']});
                localStorageService.set('uname', {uname: loginData.uname});
                // console.log(localStorageService.get('authorizationData'));

                _authentication.isAuth = true;
                _authentication.userName = loginData.uname;
            }

            deferred.resolve(data);
        })
        .error(function(err, status) {

            var error = {'status': status,
                        'description': err};
                        
            deferred.reject(error);

        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');
        localStorageService.remove('uname');

        _authentication.isAuth = false;
        _authentication.userName = "";

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        var userName = localStorageService.get('uname').uname;
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = userName;
        }

    };

    // var _refreshToken = function () {
    //     var deferred = $q.defer();

    //     var authData = localStorageService.get('authorizationData');

    //     if (authData) {

    //         if (authData.useRefreshTokens) {

    //             var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

    //             localStorageService.remove('authorizationData');

    //             $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

    //                 localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

    //                 deferred.resolve(response);

    //             }).error(function (err, status) {
    //                 _logOut();
    //                 deferred.reject(err);
    //             });
    //         }
    //     }

    //     return deferred.promise;
    // };

    // var _obtainAccessToken = function (externalData) {

    //     var deferred = $q.defer();

    //     $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

    //         localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

    //         _authentication.isAuth = true;
    //         _authentication.userName = response.userName;
    //         _authentication.useRefreshTokens = false;

    //         deferred.resolve(response);

    //     }).error(function (err, status) {
    //         _logOut();
    //         deferred.reject(err);
    //     });

    //     return deferred.promise;

    // };

    // var _registerExternal = function (registerExternalData) {

    //     var deferred = $q.defer();

    //     $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

    //         localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

    //         _authentication.isAuth = true;
    //         _authentication.userName = response.userName;
    //         _authentication.useRefreshTokens = false;

    //         deferred.resolve(response);

    //     }).error(function (err, status) {
    //         _logOut();
    //         deferred.reject(err);
    //     });

    //     return deferred.promise;

    // };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    // authServiceFactory.refreshToken = _refreshToken;

    // authServiceFactory.obtainAccessToken = _obtainAccessToken;
    // authServiceFactory.externalAuthData = _externalAuthData;
    // authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
}]);