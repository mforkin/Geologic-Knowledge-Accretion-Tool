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
                        iconClass: 'fa fa-map-marker',
                        callback: function () {
                            scope.mode = scope.mode === 'add' ? 'fullmap' : 'add';
                        }
                    },
                    {
                        iconClass: 'fa fa-globe',
                        callback: function () {
                            scope.mode = scope.mode === 'pan' ? 'fullmap' : 'pan';
                        }
                    }
                ];
            }
        };
    }]);