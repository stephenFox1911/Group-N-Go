app.controller('loginController', function ($scope, $http, $location) {
    $scope.submitRegistration = function () {
        'use strict';
        var form;
        var formData;
    
        form = document.getElementById("signin_loginForm").children;
        formData = {};
        formData.userName = form[0].value;
        formData.thePassword = form[1].value;
        
        if (form[2].value === "") {
            return false;
        } else {
            $http.post('/register', formData)
                .success(function (data, status) {
                    if (data === "True") {
                        $location.path('/home');
                        $scope.$apply();
                    } else {
                        form[0].setCustomValidity('Email address already registered!');
                        form[0].checkValidity();
                        document.getElementById('errMsg').style.visibility = 'visible';
                    }
                })
                .error(function (data, status) {
                    $scope.data = data || "Request failed";
                });
            return true;
        }
    };
    
    $scope.signup = function () {
        //find the number of inputs
        //react accordingly
        
        'use strict';
        var form;
        var formElements;
        var verifyPasswordField;

        form = document.getElementById("signin_loginForm");
        formElements = form.children;
        if (form.children.length === 4) {
            verifyPasswordField = document.createElement("input");
            verifyPasswordField.setAttribute("class", "inputField");
            verifyPasswordField.setAttribute("type", "password");
            verifyPasswordField.setAttribute("name", "passwordVerify");
            verifyPasswordField.setAttribute("placeholder", "Verify Password");
            verifyPasswordField.setAttribute("required", null);
            form.insertBefore(verifyPasswordField, formElements[2]);
        } else {
            $scope.submitRegistration();
        }
    };


    $scope.login = function () {
        'use strict';
        var form;
        var formData;

        form = document.getElementById("signin_loginForm").children;
        formData = {};
        formData.userName = form[0].value;
        formData.thePassword = form[1].value;

        $http.post('/login', formData)
            .success(function (data, status) {
                if (data === "True") {
                    $location.path('/home');
                    $scope.$apply();
                } else {
                    form[0].setCustomValidity('Username/password is incorrect');
                    form[0].checkValidity();
                    document.getElementById('errMsg').style.visibility = 'visible';
                }
            })
            .error(function (data, status) {
                $scope.data = data || "Request failed";
            });
        return true;
    };
               
});

//add a change function to first password field
//ass pattern to second field