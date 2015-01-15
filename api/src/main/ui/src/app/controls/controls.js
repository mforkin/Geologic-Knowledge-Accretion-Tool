angular.module('controls', [])

    .directive('controlPanel', [function () {
        return {
            restrict: 'E',
            scope: {
                observations: '=',
                mode: '='
            },
            templateUrl: 'controls/controls.tpl.html',
            link: function (scope, element, attrs) {
                scope.controls = [
                    {
                        iconClass: 'fa fa-search',
                        callback: function () {
                            scope.mode = scope.mode === 'search' ? 'fullmap' : 'search';
                        }
                    },
                    {
                        iconClass: 'fa fa-plus',
                        callback: function () {
                            scope.mode = scope.mode === 'add' ? 'fullmap' : 'add';
                        }
                    }
                ];
            }
        };
    }]);