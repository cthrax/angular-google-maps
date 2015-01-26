angular.module "ui-gmap.util.test.mock-google-api", []
.factory "googleMapsApi", ($q) ->
  deferred = $q.defer()
  # TODO: Might need an actual mock of the maps api here
  deferred.resolve({})
  return {
    promise: deferred.promise
  }
