angular.module 'ui-gmap.core', ['ui-gmap.providers']
.config ($provide) ->
  # Configure $log to have a noop trace function, so trace can be added in trace module
  $provide.decorator '$log', ($delegate) ->
    $delegate.trace = angular.noop unless $delegate.trace?

    return $delegate

.controller 'uiGmapController', ($scope, $log, UiGmapApi) ->
  $log.trace("CONTROLLER: ui-gmap controller defined")
  @transcludedElements = null

  # TODO: Do we monitor the uiGmap options with a watch? (Probably...)
  @api = new UiGmapApi(@, $scope.uiGmap)
  @registerFeature = (feature) =>
    $log.trace("REGISTERING: %s is registered.", feature.name)
    @api.addFeature(feature)

.directive 'uiGmap', ($log, googleMapsApi) ->
  class UiGmapLinker
    constructor: ->
      @post = (scope, ele, attrs, uiGmapCtrl, transcludeFunc) ->
        $log.trace("LINKING: ui-gmap directive")

        # TODO: 1.2.x requires a different syntax for this functionality, how do we handle both?
        ###
          1.2.x expects syntax like
          var transcludedElements = transcludeFunc(scope, function (teles, scope) { // do your attaching to DOM })
        ###
        # Using transclusion here to create elements in memory rather than attaching to DOM, this is a list of jqlite
        # elements, unfortunately including text nodes. Features can use this list to access elements if need be, but most
        # will receive their element in the link function. This can only be used in link functions, as it is not available
        # in controllers.
        #uiGmapCtrl.transcludedElements = transcludeFunc(scope.$new())

        googleMapsApi.promise.then (maps) ->
          $log.trace("RESOLVED: ui-gmap notified of google maps api")
          uiGmapCtrl.api.notifyMapsLoaded(maps)

        return

  class CoreDirective
    constructor: ->
      @restrict = "A"
      @controller = 'uiGmapController'
      #@transclude = true
      @replace = true
      @scope =
        'uiGmap': '='
      # Allows scopes to be passed in and used in templates
        'externalScopes': '&?externalScopes'

      @compile = ->
        return new UiGmapLinker()

  return new CoreDirective()
