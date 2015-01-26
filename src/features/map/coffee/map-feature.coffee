angular.module 'ui-gmap.feature.map.feature', ['ui-gmap.feature', 'ui-gmap.feature.map.api', 'ui-gmap.google-factory']
# Separate out the creation of the google native elements, so they can more easily be mocked in tests
# and creation of elements can be validated without actually rendering
.config (googleFactoryProvider) ->
  googleFactoryProvider.addFactory "map",
    create: (maps, ele, options) ->
      return new maps.Map(ele, options)
    update: (map, options) ->
      map.setOptions(options)
      return map

.factory 'MapFeature', (IFeature, MapApi, $log, googleFactory) ->
  class MapFeature extends IFeature
    render: (maps) =>
      mapOptions = @api.getOptions()
      $log.trace("RENDERING: Map with options: ", mapOptions)
      # Create the google map
      @api.setMap googleFactory.create("map", maps, @ele[0], mapOptions)

    onMapsLoaded: (api, maps) =>
      $log.trace("ADDING: Map Feature API")

    createApi: (api) =>
      $log.trace("CREATING: Map API", api)
      @api = new MapApi(@gmapCtrl, @ctrl, api, @ele)
      return @api


  return MapFeature
