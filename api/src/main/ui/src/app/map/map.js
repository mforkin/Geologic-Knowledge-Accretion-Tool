angular.module("map", [])

    .directive('map', [function () {
        return {
            restrict: 'E',
            scope: {
                observations: '=',
                mouseLatLon: '=',
                map: '='
            },
            link: function (scope, element, attrs) {
                var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    osm = new L.TileLayer(osmUrl),
                    layers = {},
                    markerIds = [],
                    siteLayer = L.layerGroup([]),
                    icon = L.icon({
                        iconUrl: 'assets/marker-icon.png',
                        iconRetinaUrl: 'assets/marker-icon@2x.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowUrl: 'assets/marker-shadow.png',
                        shadowRetinaUrl: 'assets/marker-shadow@2x.png',
                        shadowSize: [41, 41]
                    });

                _.each(scope.observations, function (ob) {
                    if (!_.contains(markerIds, ob.id)) {
                        markerIds.push(ob.id);
                        siteLayer.addLayer(L.marker([ob.lat, ob.lon], {icon: icon}).bindPopup('Tags: ' + ob.tags.join(", ") + '\nDescription:' + ob.description));
                    }
                });

                layers['Basic'] = L.tileLayer.provider('Stamen.TonerLite');
                layers['Terrain'] = L.tileLayer.provider('Acetate.terrain');
                layers['Detailed Terrain'] = L.tileLayer.provider('Acetate.all');
                layers['Hill Shading'] = L.tileLayer.provider('Acetate.hillshading');
                layers['Detailed Colored'] = L.tileLayer.provider('Esri.DeLorme');

                scope.map = L.map(element[0], {
                    center: L.latLng(40.279957,-74.73862),
                    zoom: 8,
                    maxZoom: 18,
                    minZoom: 3,
                    attributionControl: false,
                    zoomControl: false,
                    layers: [layers.Basic, siteLayer]
                });

                var zoomControl = L.control.zoom({
                    position: 'topright'
                });

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (p) {
                        scope.map.panTo({lat: p.coords.latitude, lon: p.coords.longitude});
                    });
                }

                scope.map.on("mousemove", function (obj) {
                    scope.$apply(function () { scope.mouseLatLon = obj.latlng.lat.toFixed(5) + ", " + obj.latlng.lng.toFixed(5); });
                });

                L.control.layers(layers, {Sites: siteLayer}).addTo(scope.map);

                scope.map.addControl(zoomControl);

                scope.$watch('observations', function (obs) {
                    siteLayer.clearLayers();
                    markerIds = [];
                    _.each(obs, function (ob) {
                        markerIds.push(ob.id);
                        siteLayer.addLayer(L.marker([ob.lat, ob.lon], {icon: icon}).bindPopup('Tags: ' + ob.tags.join(", ") + '\nDescription:' + ob.description));
                    });
                }, true);
            }
        };
    }]);