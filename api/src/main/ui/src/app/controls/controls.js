angular.module('controls', [])

    .directive('controlPanel', [function () {
        return {
            restrict: 'E',
            scope: {
                observations: '='
            },
            templateUrl: 'controls/controls.tpl.html',
            link: function (scope, element, attrs) {
                scope.controls = [
                    {
                        iconClass: 'fa fa-globe',
                        callback: function () {
                            console.log('globe');
                        }
                    },
                    {
                        iconClass: 'fa fa-plus',
                        callback: function () {
                            console.log('add');
                        }
                    }
                ];
            }
        };
    }]);