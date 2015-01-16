angular.module('add', [])

    .directive('add', ['Observation', '$timeout', function (Observation, $timeout) {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                mode: '='
            },
            templateUrl: 'add/add.tpl.html',
            link: function (scope, element, attrs) {
                scope.keyword = '';
                scope.keywords = [];

                scope.description = '';
                scope.addKeyword = function () {
                    if (scope.keyword !== '' && scope.keywords.indexOf(scope.keyword.toUpperCase()) < 0) {
                        scope.keywords.push(scope.keyword.toUpperCase());
                    }
                    scope.keyword = '';
                };
                scope.removeKeyword = function (kw) {
                    var idx = scope.keywords.indexOf(kw.toUpperCase());
                    if (idx >= 0) {
                        scope.keywords.splice(idx, 1);
                    }
                };
                scope.uploadDataPoint = function () {
                    Observation.post({
                        date: new Date().getTime(),
                        lat: parseFloat(scope.lat),
                        lon: parseFloat(scope.lon),
                        tags: scope.keywords,
                        description: scope.description,
                        images: []
                    }).$promise.then(function (resp) {
                        $timeout(function () { scope.data.push(resp); });
                    });
                };
            }
        };
    }]);