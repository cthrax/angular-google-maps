angular.module 'ui-gmap.feature.markers.api', ['ui-gmap.feature', 'ui-gmap.google-factory', 'lodash']
.constant 'DEFAULT_MARKERS_CONFIG',
  watchList: false
  deepWatch: false
  options: {}

.factory 'MarkersApi', (IApi, DEFAULT_MARKERS_CONFIG, $log, lodash, googleFactory) ->
  class MarkersApi extends IApi
    # TODO: Does this constructor actually need all of these?
    constructor: (uiGmapCtrl, markersCtrl, api, ele) ->
      $log.trace("CONSTRUCTING: markers API")
      super(uiGmapCtrl, markersCtrl, api, ele)
      @options = DEFAULT_MARKERS_CONFIG.options
      @queue = null
      @pendingMarkers = []

      # Add some singular functions for user convenience
      "addMarker removeMarker"
      .split " "
      .map (singular) =>
        @[singular] = (single) =>
          return @[singular + "s"]([single])

    getOptions: () =>
      return @options

    setOptions: (options) =>
      $log.trace("SETTING: markers options", options)
      @options = {} unless @options?
      # TODO: Handle the case that the map already exists and update options
      @options = angular.extend(DEFAULT_MARKERS_OPTIONS, @options, options)

    addMarkers: (markers) =>
      $log.trace("SETTING: markers element")
      # TODO: Do something if the markers already exists
      # TODO: Add async processing of markers, probably a command pattern queue that is chunked through
      # as needed. Essentially creating our own digest cycle for processing lists generically. With operations
      # for clearing command types, setting chunk size (which can be infinite for synchronous operation).
      # For now, just inefficiently add each marker.
      @markers = [] unless markers?
      @pendingMarkers = lodash.union @pendingMarkers, markers
      @markers = lodash.union @markers, markers
      return @markers

    removeMarkers: (markers) =>
      return lodash.pull @markers, markers

  return MarkersApi
