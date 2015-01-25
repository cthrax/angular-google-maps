angular.module 'ui-gmap.feature.map.api', ['ui-gmap.feature']
.constant 'DEFAULT_MAP_OPTIONS',
  center:
    lat: -34.397
    lng: 150.644
  zoom: 8

.factory 'MapApi', (IApi, DEFAULT_MAP_OPTIONS, $log) ->
  class MapApi extends IApi
    # TODO: Does this constructor actually need all of these?
    constructor: (uiGmapCtrl, mapCtrl, api, ele) ->
      $log.trace("CONSTRUCTING: map API")
      super(uiGmapCtrl, mapCtrl, api, ele)
      @options = null
      @mapInstance = null

    getOptions: () =>
      if @options?
        return @options
      else
        return DEFAULT_MAP_OPTIONS

    setOptions: (options) =>
      $log.trace("SETTING: map options", options)
      @options = {} unless !@options?
      # TODO: Handle the case that the map already exists and update options
      @options = angular.extend(DEFAULT_MAP_OPTIONS, @options, options)

    setMap: (mapEle) =>
      $log.trace("SETTING: map element")
      # TODO: Do something if the map already exists
      # XXX: This might be a good place to handle the resizing issue experienced in modals
      @mapInstance = mapEle

    getMap: =>
      return @mapInstance

  return MapApi
