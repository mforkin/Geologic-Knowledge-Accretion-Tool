angular.module('pan', [])

    .directive('pan', [function () {
        return {
            restrict: 'E',
            scope: {
                map: '&'
            },
            templateUrl: 'pan/pan.tpl.html',
            link: function (scope, element, attrs) {
                scope.panTo = function (coords) {
                    if (coords.lat && coords.lon) {
                        scope.map().panTo({lat: parseFloat(coords.lat), lon: parseFloat(coords.lon)});
                    }
                };
            }
        };
    }]);