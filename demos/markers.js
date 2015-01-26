/**
 * Created by mbostwick on 12/27/14.
 */
angular.module("demo.markers", ['ui-gmap', 'ui-gmap.feature.map', 'ui-gmap.feature.markers', 'ui-gmap.debug'])
    .controller("markersCtrl", function($scope) {
        $scope.options = {
            onApiRegistered: function(api, maps) {
                api.map.setOptions({
                    zoom: 2,
                    zoomControlOptions: {
                        style: maps.ZoomControlStyle.SMALL
                    }
                });
                api.markers.addMarker({
                    latitude: 0,
                    longitude: 0
                })
            },
            markers: {
            }
        };
    });
