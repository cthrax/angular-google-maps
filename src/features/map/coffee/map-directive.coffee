angular.module('ui-gmap.feature.map', ['ui-gmap.feature', 'ui-gmap.feature.map.feature'])
.directive 'uiGmapMap', (MapFeature, $log) ->
  class UiGmapMapLinker
    constructor: ->
      @post = (scope, ele, attrs, uiGmapCtrl) ->
        $log.trace("LINKING: map directive", uiGmapCtrl)
        options = attrs["uiGmapMap"]
        mapEle = ele

        # TODO: Do something with the options passed into the attribute
        feature = new MapFeature(uiGmapCtrl, null, mapEle, "map")
        return

  class MapDirective
    constructor: ->
      @restrict = "A"
      @require = "uiGmap"
      #@templateUrl = "features/map/templates/map.html"
      #@replace = true
      @compile = ->
        return new UiGmapMapLinker()

  return new MapDirective()

