describe "ui-gmap.feature.markers", ->
  beforeEach module "ui-gmap.debug"
  beforeEach module "ui-gmap"
  beforeEach module "ui-gmap.feature.map"
  beforeEach module "ui-gmap.feature.markers"
  beforeEach module "ui-gmap.util.test.mock-factory"
  beforeEach module "ui-gmap.util.test.mock-google-api"

  afterEach inject (googleFactoryBackend) ->
    googleFactoryBackend.assertExpectationsMet()

  it "should work with no markers", inject ($compile, $rootScope, googleFactoryBackend, DEFAULT_MAP_OPTIONS)  ->
    scope = $rootScope.$new()
    scope.options = {}
    html = '<div ui-gmap="options" ui-gmap-map>' +
              '<div ui-gmap-markers></div>' +
           '</div>'
    ele = $compile(html)(scope)
    googleFactoryBackend.expectFactoryCreate("map", {}, ele[0], DEFAULT_MAP_OPTIONS)
    scope.$apply()

  it "should create a marker", inject ($compile, $rootScope, googleFactoryBackend, DEFAULT_MAP_OPTIONS) ->
    scope = $rootScope.$new()
    # This is a huge PITA, it just terrible that google names
    # the properties lat and lng, in order to make this easy on the
    # consumer, we either have to translate some non-standard marker option
    # like latitude/longitude to position or expose a separate property
    # for options on each marker that can be passed directly to google
    # then combine this with options passed to the markers directive,
    # for now, just have the added per marker options and combine, but
    # this could really use some thought
    marker =
      latitude: 0
      longitude: 0

    scope.options =
      onApiRegistered: (api, maps) ->
        expectedMarker =
          position:
            lat: 0
            lng: 0
          map: {}

        api.markers.addMarker marker
        # Should be rendered after api call
        googleFactoryBackend.expectFactoryCreate("markers", maps, expectedMarker)

    html = '<div ui-gmap="options" ui-gmap-map>' +
        '<div ui-gmap-markers></div>' +
        '</div>'
    ele = $compile(html)(scope)
    googleFactoryBackend.expectFactoryCreate("map", {}, ele[0], DEFAULT_MAP_OPTIONS)
    scope.$apply()
