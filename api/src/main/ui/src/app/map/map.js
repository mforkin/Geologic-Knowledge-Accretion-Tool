angular.module("map", [])

    .directive('map', [function () {
        return {
            restrict: 'E',
            scope: {
                observations: '='
            },
            link: function (scope, element, attrs) {
                var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    osm = new L.TileLayer(osmUrl),
                    map = L.map(element[0], {
                        center: L.latLng(40.279957,-74.73862),
                        zoom: 8,
                        maxZoom: 18,
                        minZoom: 3,
                        attributionControl: false,
                        zoomControl: false
                    });

                var zoomControl = L.control.zoom({
                    position: 'topright'
                });

                map.addControl(zoomControl);

                L.tileLayer.provider('Stamen.TonerLite').addTo(map);
            }
        };
    }]);