angular.module 'ui-gmap.debug', []
.config ($logProvider) ->
  # by virtue of including this module, set debug true
  $logProvider.debugEnabled(true)

.config ($provide) ->
  # If possible, configure log to be a bit more useful with stacktrace.js
  $provide.decorator '$log', ($delegate) ->
    if typeof window.printStackTrace == "function"
      debug = $delegate['debug']
      $delegate.trace = ->
        if $delegate.traceEnabled
          debug.apply($delegate, arguments)

      ['log', 'info', 'warn', 'debug', 'trace'].map (operation) ->
        # Get original function
        original = $delegate[operation]
        $delegate[operation] = ->
          if console.groupCollapsed?
            console.groupCollapsed.apply(console, arguments)

          original.apply($delegate, arguments)

          stackLine = printStackTrace()[4]
          newArgs = ["$log call source", stackLine.split("@")[1]]
          # Throw source onto the method, since everything is homogenized to angular's code
          debug.apply($delegate, newArgs)
          if console.groupEnd?
            console.groupEnd()

    return $delegate

  # Double throw exception, a little weird, but at least there is a sourcemap in the second print in the console
  $provide.decorator '$exceptionHandler', ($delegate) ->
    return (exception, cause) ->
      $delegate(exception, cause)
      throw exception

    return $delegate

.run ($log) ->
  # By virtue of including this module, set tracing on
  $log.traceEnabled = true
