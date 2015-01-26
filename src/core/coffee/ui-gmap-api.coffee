angular.module "ui-gmap.api", []
.factory 'UiGmapApi', ($log, DEFAULT_MAP_OPTIONS) ->
  class UiGmapApi
    constructor: (uiGmapCtrl, uiGmapOptions) ->
      $log.trace("CONSTRUCTING: ui-gmap API", uiGmapOptions)
      @mapCtrl = uiGmapCtrl
      @uiGmapOptions = uiGmapOptions
      @isLoaded = false
      @mapsNamespace = null
      @features = []

    addFeature: (feature) =>
      $log.trace("ADDING: feature " + feature.name)
      @features.push(feature)
      api = feature.createApi(@)
      @[feature.name] = api

    notifyMapsLoaded: (maps) =>
      $log.trace("NOTIFY: API notified of maps loaded")
      @mapsNamespace = maps

      # TODO: optimize this later
      # Find map feature and load first so other features can use it
      @features.map (feature) =>
        if (feature.name == "map")
          feature.onMapsLoaded(@, maps)

      # Notify and load all features
      @features.map (feature) =>
        if (feature.name != "map")
          feature.onMapsLoaded(@, maps)

      # Notify consumer that api is registered
      @uiGmapOptions.onApiRegistered(@, maps) if @uiGmapOptions.onApiRegistered?


      # TODO: optimize this later
      # Find map feature and render first, so others can use it
      @features.map (feature) =>
        if (feature.name == "map")
          feature.render(maps)

      @features.map (feature) ->
        if (feature.name != "map")
          feature.render(maps)

      # Get default options
      @uiGmapOptions.mapOptions = angular.extend(DEFAULT_MAP_OPTIONS, @uiGmapOptions.mapOptions)

    # Returns the google maps namespace for native access to the API
    maps: () =>
      return @mapsNamespace

    # Returns the google maps native object associated with this map instance.
    # Note: that a promise is not necessary as this service is only available after
    # everything loads
    getMap: =>
      return @mapCtrl.map

    askForBounds: =>
      return @

  return UiGmapApi
