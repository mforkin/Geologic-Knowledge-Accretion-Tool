angular.module('gkat.home', [
    'map',
    'controls',
    'search',
    'add',
    'pan'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.tpl.html',
            controller: 'HomeController'
        });
    }])

    .controller('HomeController', ['$scope', function($scope) {
        $scope.data = {
            observations: [],
            mode: 'fullmap',
            mouseLatLon: 'Lat, Lon',
            map: null
        };
    }]);
