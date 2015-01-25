# Base module for creating a feature
angular.module 'ui-gmap.feature', []
.factory 'IFeature', ($log) ->
  # The feature is the internal definition of the functionality
  # This enables a separation from what is exposed to the consumer
  # and what is needed for internal functionality
  class IFeature
    constructor: (uiGmapCtrl, ctrl, ele, name) ->
      $log.trace("CONSTRUCTING: feature " + name)
      @gmapCtrl = uiGmapCtrl
      @ctrl = ctrl
      @ele = ele
      @name = name

      # api is instantiated after google maps is loaded
      @api = null
      # Register feature with main directive
      uiGmapCtrl.registerFeature(@)

    render: =>
      throw new Error("Must be implemented by subclass")

    createApi: (api) =>
      throw new Error("Must be implemented by subclass")

    onMapsLoaded: (api, maps) =>
      throw new Error("Must be implemented by subclass")

  return IFeature

.factory "IApi", ($log) ->
  # The API is the publicly exposed methods for a consumer
  # this allows a separation of internal functions and external
  # functions.
  class IApi
    # TODO: Does this constructor actually need all this?
    constructor: (uiGmapCtrl, featureCtrl, api, ele) ->
      @api = api
      $log.trace("CONSTRUCTING: feature api")
      # Initialize events object
      @on = {}

