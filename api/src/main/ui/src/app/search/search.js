angular.module('search', [])

    .directive('search', ['Observation', function (Observation) {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                mode: '='
            },
            templateUrl: 'search/search.tpl.html',
            link: function (scope, element, attrs) {
                var queryPnt = null;
                scope.doSearch = function () {
                    Observation.query({
                        queryString: scope.queryString
                    }).$promise.then(function (results) {
                        if (scope.useBounds && scope.lat && scope.lon && scope.radius) {
                            queryPnt = new L.LatLng(parseFloat(scope.lat), parseFloat(scope.lon));
                        } else {
                            queryPnt = null;
                        }
                        if (queryPnt) {
                            scope.data = results.filter(function (p) {
                                //meters in a mile
                                if (new L.LatLng(p.lat, p.lon).distanceTo(queryPnt) / 1609.34 < scope.radius) {
                                    return true;
                                }
                                return false;
                            });
                        } else {
                            scope.data = results;
                        }
                    });
                };
            }
        };
    }]);