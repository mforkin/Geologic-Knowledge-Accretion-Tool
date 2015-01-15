angular.module('add', [])

    .directive('add', [function () {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                mode: '='
            },
            templateUrl: 'add/add.tpl.html',
            link: function () {
                scope.doAdd = function () {
                    console.log('adding...');
                };
            }
        };
    }]);