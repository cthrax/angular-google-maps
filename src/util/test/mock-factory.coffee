angular.module "ui-gmap.util.test.mock-factory", ["lodash"]
# Control object, similar to $httpBackend for setting expectations
# on a factory
.factory "googleFactoryBackend", (lodash, $log) ->
  class FactoryBackend
    constructor: ->
      @expectedCalls = {}
      @expectedUpdates = {}

    # TODO: This could be fleshed out to expect more than one call
    # right now this sets up the expected order and number
    expectFactoryCreate: (factoryName, args...) =>
      if !@expectedCalls[factoryName]?
        @expectedCalls[factoryName] = []

      @expectedCalls[factoryName].push args

    expectFactoryUpdate: (factoryName, args...) =>
      if !@expectedUpdates[factoryName]?
        @expectedUpdates[factoryName] = []

      @expectedCalls[factoryName].push args


    setFactories: (factories) =>
      @factory = factories

    _handleExpectation: (list, factoryName, parameters) ->
      if list[factoryName]?
        args = list[factoryName].shift()
        try
          expect(args).to.deep.equal(parameters)
        catch e
          # The default log message is pretty useless. Make it a little more useful
          console.log("Expected: %o", args)
          console.log("Actual  : %o", parameters)
          throw e

      else
        expect(false).to.equal(true, "No expectation for " + factoryName + " factory call")

    update: (factoryName, parameters...) =>
      @_handleExpectation(@expectedUpdates, factoryName, parameters)
      return {}

    create: (factoryName, parameters...) =>
      @_handleExpectation(@expectedCalls, factoryName, parameters)
      return {}

    assertExpectationsMet: =>
      checkForExpectations = (list, key) ->
        try
          expect(list).to.be.empty
        catch e
          console.error("Expected %s factory to be called, but wasn't", key)
          throw e

      lodash.forEach(@expectedCalls, checkForExpectations)
      lodash.forEach(@expectedUpdates, checkForExpectations)

  return new FactoryBackend()
