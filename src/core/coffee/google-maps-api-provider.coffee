# The service, that is a promise for a reference to window.google.maps
# TODO: Fix the wrapped libraries to be a little less build dependent
angular.module('ui-gmap.providers', ['ui-gmap.wrapped'])
.factory 'googleApiLoader', ($q, uuid, $log) ->
  class GoogleApiLoader
    constructor: ->
      @scriptId = undefined
      @idFactory = null

    scriptLoader: (url) =>
      $log.trace("LOADING: google maps API script with url: " + url)
      document.getElementById(@scriptId).remove() if @scriptId
      @scriptId = @idFactory()

      script = document.createElement 'script'
      script.id = @scriptId
      script.type = 'text/javascript'
      script.src = url
      document.body.appendChild script

    getScriptUrl: (options) ->
      options.url

    getRandomFunctionName: ->
      return 'onGoogleMapsReady' + Math.round(Math.random() * 1000)

    load: (options) ->
      deferred = $q.defer()
      # Early-resolve if google-maps-api is already in global-scope
      if angular.isDefined(window.google) and angular.isDefined(window.google.maps)
        $log.trace("RESOLVING: early resolve of google maps api")
        deferred.resolve window.google.maps
        return deferred.promise


      randomizedFunctionName = options.callback = @getRandomFunctionName()
      console.log(randomizedFunctionName)
      window[randomizedFunctionName] = ->
        window[randomizedFunctionName] = null
        # Resolve the promise
        $log.trace("RESOLVING: google maps API called callback")
        deferred.resolve window.google.maps
        return

      query = _.map options, (v, k) ->
        k + '=' + v unless k == "url"
      .filter (k) ->
        !!k ? true: false

      query = query.join '&'
      url = @getScriptUrl(options) + "?" + query
      @idFactory = ->
        "ui_gmap_map_load_" + uuid.generate()

      @scriptLoader(url)
      # Return the promise
      deferred.promise

  return new GoogleApiLoader()

# holy hool!!, any time your passing a dependency to a 'provider' you
# must append the Provider text to the service
# name.. makes no sense and this is not documented well
.provider 'googleMapsApi', ->
  # Some nice default options
  @options =
    #    key: 'api-key here',
    v: '3.17'
    libraries: ''
    language: 'en'
    sensor: 'false'
    url: 'https://maps.googleapis.com/maps/api/js'

  # A function that lets us configure options of the service
  @configure = (options) ->
    angular.extend @options, options
    return

  # Return an instance of the service
  @$get = (googleApiLoader) =>
    loader = googleApiLoader.load @options
    return {
      promise: loader
    }

  return @
