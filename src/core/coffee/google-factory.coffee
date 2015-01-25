angular.module "ui-gmap.google-factory", []
.factory "googleFactoryBackend", ->
  # Create a factory backend so that it can be replaced for testing
  # This separates the rest of the code from the google API, allowing for more thorough testing
  class FactoryBackend
    constructor: ->
      @factories = {}

    setFactories: (factories) =>
      @factories = factories

    # Used for creation of new elements
    create: (factoryName, parameters...) =>
      return @factories[factoryName].create.apply(null, parameters)

    # Used for updating existing elements, which might create a new element
    update: (factoryName, parameters...) =>
      return @factories[factoryName].update.apply(null, parameters)

  return new FactoryBackend()

.provider "googleFactory", ->
  factories = {}
  class FactoryBackendProvider
    addFactory: (factoryName, factory) ->
      factories[factoryName] = factory

    # Make this a non-bound function because angular can't inject
    # if it's not
    $get: (googleFactoryBackend) ->
      googleFactoryBackend.setFactories(factories)
      return googleFactoryBackend

  return new FactoryBackendProvider()
