angular.module('gkat.home', [
    'map',
    'controls',
    'search',
    'add',
    'pan'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.tpl.html'
        });
    }])

    .controller('HomeController', ['$scope', 'Observation', function($scope, Observation) {
        $scope.data = {
            observations: [],
            mode: 'fullmap',
            mouseLatLon: 'Lat, Lon',
            map: null
        };

        Observation.query().$promise.then(function (obs) {
            $scope.data.observations = obs;
        });


    }]);
