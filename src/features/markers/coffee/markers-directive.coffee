angular.module('ui-gmap.feature.markers', ['ui-gmap.feature', 'ui-gmap.feature.markers.feature'])
.directive 'uiGmapMarkers', (MarkersFeature, $log) ->
  class UiGmapMarkersLinker
    constructor: ->
      @post = (scope, ele, attrs, uiGmapCtrl, transcludeFunc) ->
        $log.trace("LINKING: markers directive", uiGmapCtrl)
        options = attrs["uiGmapMarkers"]
        element = transcludeFunc(scope)

        # TODO: Do something with the options passed into the attribute
        feature = new MarkersFeature(uiGmapCtrl, null, options.list, "markers")
        return

  class MarkersDirective
    constructor: ->
      @restrict = "A"
      @require = "^uiGmap"
      @transclude = true
      #@templateUrl = "features/markers/templates/markers.html"
      @compile = ->
        return new UiGmapMarkersLinker()

  return new MarkersDirective()
