angular.module('add', [])

    .directive('add', [function () {
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
                scope.doAdd = function () {
                    console.log('adding...');
                };
                scope.description = '';
                scope.addKeyword = function () {
                    if (scope.keyword !== '' && scope.keywords.indexOf(scope.keyword) < 0) {
                        scope.keywords.push(scope.keyword);
                    }
                    scope.keyword = '';
                };
                scope.removeKeyword = function (kw) {
                    var idx = scope.keywords.indexOf(kw);
                    if (idx >= 0) {
                        scope.keywords.splice(idx, 1);
                    }
                };
                scope.uploadDataPoint = function () {
                    console.log('uploading point...');
                };
            }
        };
    }]);