angular.module('search', [])

    .directive('search', [function () {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                mode: '='
            },
            templateUrl: 'search/search.tpl.html',
            link: function (scope, element, attrs) {
                scope.doSearch = function () {
                    console.log('searching...');
                };
            }
        };
    }]);