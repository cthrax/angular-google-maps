describe "ui-gmap.providers", ->
  @loader = null
  @options = {}

  beforeEach module 'ui-gmap.debug'
  beforeEach module 'ui-gmap'
  beforeEach module 'ui-gmap.providers'
  beforeEach module(($provide) =>
    ## Mock scriptloader
    $provide.decorator('googleApiLoader', ($delegate) =>
      class Loader
        constructor: ->
          @calls = []

        func: (url) =>
          console.log("Calling decorated function")
          id = "onGoogleMapsReady" + 1
          @calls.push
            url: url
            id:id
            #callback: @options.callback
          id

        calledWith: () =>
          return @calls

      @loader = new Loader()
      $delegate.scriptLoader = @loader.func.bind(@loader)
      return $delegate
    )
    $provide.factory('uuid', () ->
      class UUID
        generate: =>
          return "uuid"

      return new UUID()
    )
    return
  )

  beforeEach =>
    @options =
      v: "1.4"
      url: "http://maps/api.js"
      libraries: ['foo', 'bar']
      key: 'areallylongkey'
      language: 'fr'
      sensor: 'false'

  beforeEach () =>
    # Create a module that configures the provider
    angular.module('testapp', ['ui-gmap.providers'])
      .config (googleMapsApiProvider) =>
        googleMapsApiProvider.configure(@options)
        @options = googleMapsApiProvider.options
        return
    return

  beforeEach module 'testapp'

  # Unfortunately there is an issue with testing multiple configs on the provide because the config is only run
  # once per injector and the injector doesn't seem to be reset between tests, so just test a populated config
  it "should take all values from config", () =>
    inject (googleMapsApi, $rootScope) =>
      window.google = {
        maps: {}
      }
      googleMapsApi.promise.then (maps) =>
        expect(@loader.calls.length).to.equal(1)
        expect(@loader.calls[0].url).to.match(/http:\/\/maps\/api\.js\?v=1\.4&libraries=foo,bar&language=fr&sensor=false&key=areallylongkey&callback=onGoogleMapsReady[0-9]+/)
        expect(maps).to.equal(window.google.maps)

      window[@options.callback]()
      $rootScope.$apply()
    return

