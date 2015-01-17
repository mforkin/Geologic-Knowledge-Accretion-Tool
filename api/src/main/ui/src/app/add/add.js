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

                scope.imageFile = {};
                scope.sampleImages = [];

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
                        images: scope.sampleImages
                    }).$promise.then(function (resp) {
                        $timeout(function () { scope.data.push(resp); });
                        scope.sampleImages = [];
                        scope.lat = '';
                        scope.lon = '';
                        scope.description = '';
                        scope.keywords = [];
                        scope.keyword = '';
                        scope.mode = 'fullmap';
                    });
                };

                function imageAdded (response) {
                    scope.sampleImages.push(response.name);
                    scope.imageFile.fileInfo = null;
                    scope.imageFile.formData = null;
                }

                scope.$watch('imageFile', function (file) {
                    if (file && file.formData) {
                        $.ajax({
                            url: 'rest/observation/image',
                            data: file.formData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            type: 'POST',
                            success: imageAdded
                        });
                    }
                });
            }
        };
    }]);