describe "ui-gmap.feature.map", ->
  beforeEach module "ui-gmap.debug"
  beforeEach module "ui-gmap"
  beforeEach module "ui-gmap.feature.map"
  beforeEach module "ui-gmap.util.test.mock-factory"
  beforeEach module "ui-gmap.util.test.mock-google-api"

  afterEach inject (googleFactoryBackend) ->
    googleFactoryBackend.assertExpectationsMet()

  it "should default options", inject ($compile, $rootScope, googleFactoryBackend, DEFAULT_MAP_OPTIONS)  ->
    scope = $rootScope.$new()
    scope.options = {}
    ele = $compile('<div ui-gmap="options" ui-gmap-map></div>')(scope)
    googleFactoryBackend.expectFactoryCreate("map", {}, ele[0], DEFAULT_MAP_OPTIONS)
    scope.$apply()

  it "should use consumer options", inject ($compile, $rootScope, googleFactoryBackend, DEFAULT_MAP_OPTIONS) ->
    scope = $rootScope.$new()

    # Consumer options
    options =
      zoom: 20,
      zoomControlOptions:
        style: "SMALL"

    scope.options =
      onApiRegistered: (api, maps) ->
        api.map.setOptions options

    ele = $compile('<div ui-gmap="options" ui-gmap-map></div>')(scope)
    googleFactoryBackend.expectFactoryCreate("map", {}, ele[0], angular.extend(DEFAULT_MAP_OPTIONS, options))
    scope.$apply()
