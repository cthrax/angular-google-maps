angular.module 'ui-gmap.feature.markers.feature', ['ui-gmap.feature', 'ui-gmap.feature.markers.api', 'lodash', 'ui-gmap.google-factory']
.config (googleFactoryProvider) ->
  googleFactoryProvider.addFactory "markers",
    create: (maps, options) ->
      return new maps.Marker(options)
    update: (markers, options) ->
      markers.setOptions(options)
      return map

.factory 'MarkersFeature', (IFeature, MarkersApi, $log, lodash, googleFactory) ->
  class MarkersFeature extends IFeature
    render: (maps, map) =>
      markersOptions = @markersApi.getOptions()
      $log.trace("RENDERING: Markers with options: ", markersOptions)
      #@api.setMap new maps.Map(@ele[0], markersOptions)

      # @TODO: This is where the markers should be rendered, but
      # they are added in the api. Figure out a better way to communicate
      # what needs to be rendered and how to initiate that. (Likely an external
      # digest loop, much like described in the API)
      @markersApi.pendingMarkers.map (marker) =>
        if marker.options?
          localMarkerOptions = angular.extend(markersOptions, marker.options)
        else
          localMarkerOptions = markersOptions

        # TODO: Figure out a better way to handle options, so creation is not
        # so cluttered, as it stands there are number of properties that would have
        # to be checked, which is a bit ugly.

        # if there's no position defined, we need to define it
        if ! localMarkerOptions.position?
          localMarkerOptions.position =
            lat: marker.latitude
            lng: marker.longitude

        # This is likely always the case, but best to assume not
        if ! localMarkerOptions.map?
          localMarkerOptions.map = @api.map.getMap()

        googleFactory.create "markers", @api.maps(), localMarkerOptions

      @api.pendingMarkers = []

    onMapsLoaded: (api, maps) =>
      @api = api
      $log.trace("ADDING: Markers Feature API")

    createApi: (api) =>
      $log.trace("CREATING: Markers API", api)
      @markersApi = new MarkersApi(@gmapCtrl, @ctrl, api, @ele)
      return @markersApi

  return MarkersFeature
