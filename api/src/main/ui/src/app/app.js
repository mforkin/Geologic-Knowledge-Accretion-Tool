angular.module('gkat', [
    'ngRoute',
    'ngResource',
    'templates-app',
    'gkat.home'
])
    .config(['$routeProvider', function ($routeProvider) {
        // Configure route provider to transform any undefined hashes to /home.
        $routeProvider.otherwise({redirectTo: '/home'});
    }])

    .constant('appInfo', {
        name: 'gkat',
        title: 'Gkat'
    })

    .controller('AppController', ['$scope', 'appInfo', function ($scope, appInfo) {
        $scope.appModel = {
            appName: appInfo.name,
            appTitle: appInfo.title
        };
    }])

    .directive("multipartFile", [function () {
        return {
            scope: {
                multipartFile: "="
            },
            link: function (scope, element, attr) {
                element.bind("change", function (event) {
                    var formData = new FormData();
                    scope.$apply(function () {
                        formData.append('file', event.target.files[0]);

                        scope.multipartFile = {
                            fileInfo: event.target.files,
                            formData: formData
                        };
                    });
                });
            }
        };
    }])

    .factory("Observation", ['$resource', function ($resource) {
        return $resource('rest/observation', {}, {
            post: {method: 'POST', isArray: false},
            query: {method: 'GET', isArray: true}
        });
    }]);
