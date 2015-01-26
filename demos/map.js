angular.module("demo.map", ['ui-gmap', 'ui-gmap.feature.map', 'ui-gmap.core.debug'])
    .controller("mapCtrl", function($scope) {
        $scope.options = {
            onApiRegistered: function(api, maps) {
                console.log("Api Registered called!", api);
                api.map.setOptions({
                    zoom: 20,
                    zoomControlOptions: {
                        style: maps.ZoomControlStyle.SMALL
                    }
                })
            }
        };
    });