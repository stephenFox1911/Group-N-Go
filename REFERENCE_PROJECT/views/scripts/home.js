app.controller('homeController', function ($scope, $http, $location) {
    $scope.setupGroups = function () {
        'use strict';
        var card;
        var body;
    
        card = document.getElementById("myGroups");
        body = document.createElement('div');
        if ($scope.groups.length > 0) {
            //make a list
        } else {
            body.setAttribute("class", "emptyList");
            body.innerHTML = "You do not have any groups yet. Click 'Add Group' to add one!";
            
        }
        card.appendChild(body);
        var newheight = card.style.height + body.clientHeight;
        card.style.height = newheight + 'px';
    };
    
    $scope.setupClusters = function () {
        'use strict';
        var card;
        var body;
    
        card = document.getElementById("myClusters");
        body = document.createElement('div');
        if ($scope.groups.length > 0) {
            //make a list
        } else {
            body.setAttribute("class", "emptyList");
            body.innerHTML = "You do not have any clusters yet. Click 'Add Cluster' to add one!";
        }
        card.appendChild(body);
        var newheight = card.style.height + body.clientHeight;
        card.style.height = newheight + 'px';
    };
    
    $scope.setupNodes = function () {
        'use strict';
        var card;
        var body;
    
        card = document.getElementById("myNodes");
        body = document.createElement('div');
        if ($scope.groups.length > 0) {
            //make a list
        } else {
            body.setAttribute("class", "emptyList");
            body.innerHTML = "You do not have any nodes yet. Click 'Add Nodes' to add one!";
        }
        card.appendChild(body);
        var newheight = card.style.height + body.clientHeight;
        card.style.height = newheight + 'px';
    };
    
    $scope.init = function() {
        $scope.groups = [];
        $scope.clusters = [];
        $scope.nodes = [];

        var formData = {};

        $http.post('/groups', formData)
            .success(function (data, status) {
                $scope.groups = data;
                $scope.setupGroups();
            })
            .error(function (data, status) {
                $scope.groups = [];
                $scope.setupGroups();
            });

        $http.post('/clusters', formData)
            .success(function (data, status) {
                $scope.clusters = data;
                $scope.setupClusters();
            })
            .error(function (data, status) {
                $scope.clusters = [];
                $scope.setupClusters();
            });

        $http.post('/nodes', formData)
            .success(function (data, status) {
                $scope.nodes = data;
                $scope.setupNodes();
            })
            .error(function (data, status) {
                $scope.nodes = [];
                $scope.setupNodes();
            });
    }
});