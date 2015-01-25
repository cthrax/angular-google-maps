/**
 * UUID.core.js: The minimal subset of the RFC-compliant UUID generator UUID.js.
 *
 * @fileOverview
 * @author  LiosK
 * @version core-1.0
 * @license The MIT License: Copyright (c) 2012 LiosK.
 */

/** @constructor */
function UUID() {}

/**
 * The simplest function to get an UUID string.
 * @returns {string} A version 4 UUID string.
 */
UUID.generate = function() {
  var rand = UUID._gri, hex = UUID._ha;
  return  hex(rand(32), 8)          // time_low
        + "-"
        + hex(rand(16), 4)          // time_mid
        + "-"
        + hex(0x4000 | rand(12), 4) // time_hi_and_version
        + "-"
        + hex(0x8000 | rand(14), 4) // clock_seq_hi_and_reserved clock_seq_low
        + "-"
        + hex(rand(48), 12);        // node
};

/**
 * Returns an unsigned x-bit random integer.
 * @param {int} x A positive integer ranging from 0 to 53, inclusive.
 * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
 */
UUID._gri = function(x) { // _getRandomInt
  if (x <   0) return NaN;
  if (x <= 30) return (0 | Math.random() * (1 <<      x));
  if (x <= 53) return (0 | Math.random() * (1 <<     30))
                    + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
  return NaN;
};

/**
 * Converts an integer to a zero-filled hexadecimal string.
 * @param {int} num
 * @param {int} length
 * @returns {string}
 */
UUID._ha = function(num, length) {  // _hexAligner
  var str = num.toString(16), i = length - str.length, z = "0";
  for (; i > 0; i >>>= 1, z += z) { if (i & 1) { str = z + str; } }
  return str;
};

// vim: et ts=2 sw=2

angular.module('ui-gmap.wrapped', [])
.factory('uuid', function() {
    return window.UUID;
});

(function() {
  angular.module("lodash", []).factory("lodash", function() {
    return _;
  });

}).call(this);

(function(module) {
try { module = angular.module("ui-gmap.templates"); }
catch(err) { module = angular.module("ui-gmap.templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("features/map/templates/map.html",
    "<div class=\"angular-google-map\">\n" +
    "</div>");
}]);
})();

(function(module) {
try { module = angular.module("ui-gmap.templates"); }
catch(err) { module = angular.module("ui-gmap.templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("features/markers/templates/markers.html",
    "<div></div>");
}]);
})();

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('ui-gmap.feature', []).factory('IFeature', ["$log", function($log) {
    var IFeature;
    IFeature = (function() {
      function IFeature(uiGmapCtrl, ctrl, ele, name) {
        this.onMapsLoaded = __bind(this.onMapsLoaded, this);
        this.createApi = __bind(this.createApi, this);
        this.render = __bind(this.render, this);
        $log.trace("CONSTRUCTING: feature " + name);
        this.gmapCtrl = uiGmapCtrl;
        this.ctrl = ctrl;
        this.ele = ele;
        this.name = name;
        this.api = null;
        uiGmapCtrl.registerFeature(this);
      }

      IFeature.prototype.render = function() {
        throw new Error("Must be implemented by subclass");
      };

      IFeature.prototype.createApi = function(api) {
        throw new Error("Must be implemented by subclass");
      };

      IFeature.prototype.onMapsLoaded = function(api, maps) {
        throw new Error("Must be implemented by subclass");
      };

      return IFeature;

    })();
    return IFeature;
  }]).factory("IApi", ["$log", function($log) {
    var IApi;
    return IApi = (function() {
      function IApi(uiGmapCtrl, featureCtrl, api, ele) {
        this.api = api;
        $log.trace("CONSTRUCTING: feature api");
        this.on = {};
      }

      return IApi;

    })();
  }]);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  angular.module("ui-gmap.google-factory", []).factory("googleFactoryBackend", function() {
    var FactoryBackend;
    FactoryBackend = (function() {
      function FactoryBackend() {
        this.update = __bind(this.update, this);
        this.create = __bind(this.create, this);
        this.setFactories = __bind(this.setFactories, this);
        this.factories = {};
      }

      FactoryBackend.prototype.setFactories = function(factories) {
        return this.factories = factories;
      };

      FactoryBackend.prototype.create = function() {
        var factoryName, parameters;
        factoryName = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this.factories[factoryName].create.apply(null, parameters);
      };

      FactoryBackend.prototype.update = function() {
        var factoryName, parameters;
        factoryName = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this.factories[factoryName].update.apply(null, parameters);
      };

      return FactoryBackend;

    })();
    return new FactoryBackend();
  }).provider("googleFactory", function() {
    var FactoryBackendProvider, factories;
    factories = {};
    FactoryBackendProvider = (function() {
      function FactoryBackendProvider() {}

      FactoryBackendProvider.prototype.addFactory = function(factoryName, factory) {
        return factories[factoryName] = factory;
      };

      FactoryBackendProvider.prototype.$get = function(googleFactoryBackend) {
        googleFactoryBackend.setFactories(factories);
        return googleFactoryBackend;
      };

      return FactoryBackendProvider;

    })();
    return new FactoryBackendProvider();
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('ui-gmap.providers', ['ui-gmap.wrapped']).factory('googleApiLoader', ["$q", "uuid", "$log", function($q, uuid, $log) {
    var GoogleApiLoader;
    GoogleApiLoader = (function() {
      function GoogleApiLoader() {
        this.scriptLoader = __bind(this.scriptLoader, this);
        this.scriptId = void 0;
        this.idFactory = null;
      }

      GoogleApiLoader.prototype.scriptLoader = function(url) {
        var script;
        $log.trace("LOADING: google maps API script with url: " + url);
        if (this.scriptId) {
          document.getElementById(this.scriptId).remove();
        }
        this.scriptId = this.idFactory();
        script = document.createElement('script');
        script.id = this.scriptId;
        script.type = 'text/javascript';
        script.src = url;
        return document.body.appendChild(script);
      };

      GoogleApiLoader.prototype.getScriptUrl = function(options) {
        return options.url;
      };

      GoogleApiLoader.prototype.getRandomFunctionName = function() {
        return 'onGoogleMapsReady' + Math.round(Math.random() * 1000);
      };

      GoogleApiLoader.prototype.load = function(options) {
        var deferred, query, randomizedFunctionName, url;
        deferred = $q.defer();
        if (angular.isDefined(window.google) && angular.isDefined(window.google.maps)) {
          $log.trace("RESOLVING: early resolve of google maps api");
          deferred.resolve(window.google.maps);
          return deferred.promise;
        }
        randomizedFunctionName = options.callback = this.getRandomFunctionName();
        console.log(randomizedFunctionName);
        window[randomizedFunctionName] = function() {
          window[randomizedFunctionName] = null;
          $log.trace("RESOLVING: google maps API called callback");
          deferred.resolve(window.google.maps);
        };
        query = _.map(options, function(v, k) {
          if (k !== "url") {
            return k + '=' + v;
          }
        }).filter(function(k) {
          var _ref;
          return (_ref = !!k) != null ? _ref : {
            "true": false
          };
        });
        query = query.join('&');
        url = this.getScriptUrl(options) + "?" + query;
        this.idFactory = function() {
          return "ui_gmap_map_load_" + uuid.generate();
        };
        this.scriptLoader(url);
        return deferred.promise;
      };

      return GoogleApiLoader;

    })();
    return new GoogleApiLoader();
  }]).provider('googleMapsApi', function() {
    this.options = {
      v: '3.17',
      libraries: '',
      language: 'en',
      sensor: 'false',
      url: 'https://maps.googleapis.com/maps/api/js'
    };
    this.configure = function(options) {
      angular.extend(this.options, options);
    };
    this.$get = (function(_this) {
      return ["googleApiLoader", function(googleApiLoader) {
        var loader;
        loader = googleApiLoader.load(_this.options);
        return {
          promise: loader
        };
      }];
    })(this);
    return this;
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module("ui-gmap.api", []).factory('UiGmapApi', ["$log", "DEFAULT_MAP_OPTIONS", function($log, DEFAULT_MAP_OPTIONS) {
    var UiGmapApi;
    UiGmapApi = (function() {
      function UiGmapApi(uiGmapCtrl, uiGmapOptions) {
        this.askForBounds = __bind(this.askForBounds, this);
        this.getMap = __bind(this.getMap, this);
        this.maps = __bind(this.maps, this);
        this.notifyMapsLoaded = __bind(this.notifyMapsLoaded, this);
        this.addFeature = __bind(this.addFeature, this);
        $log.trace("CONSTRUCTING: ui-gmap API", uiGmapOptions);
        this.mapCtrl = uiGmapCtrl;
        this.uiGmapOptions = uiGmapOptions;
        this.isLoaded = false;
        this.mapsNamespace = null;
        this.features = [];
      }

      UiGmapApi.prototype.addFeature = function(feature) {
        var api;
        $log.trace("ADDING: feature " + feature.name);
        this.features.push(feature);
        api = feature.createApi(this);
        return this[feature.name] = api;
      };

      UiGmapApi.prototype.notifyMapsLoaded = function(maps) {
        $log.trace("NOTIFY: API notified of maps loaded");
        this.mapsNamespace = maps;
        this.features.map((function(_this) {
          return function(feature) {
            if (feature.name === "map") {
              return feature.onMapsLoaded(_this, maps);
            }
          };
        })(this));
        this.features.map((function(_this) {
          return function(feature) {
            if (feature.name !== "map") {
              return feature.onMapsLoaded(_this, maps);
            }
          };
        })(this));
        if (this.uiGmapOptions.onApiRegistered != null) {
          this.uiGmapOptions.onApiRegistered(this, maps);
        }
        this.features.map((function(_this) {
          return function(feature) {
            if (feature.name === "map") {
              return feature.render(maps);
            }
          };
        })(this));
        this.features.map(function(feature) {
          if (feature.name !== "map") {
            return feature.render(maps);
          }
        });
        return this.uiGmapOptions.mapOptions = angular.extend(DEFAULT_MAP_OPTIONS, this.uiGmapOptions.mapOptions);
      };

      UiGmapApi.prototype.maps = function() {
        return this.mapsNamespace;
      };

      UiGmapApi.prototype.getMap = function() {
        return this.mapCtrl.map;
      };

      UiGmapApi.prototype.askForBounds = function() {
        return this;
      };

      return UiGmapApi;

    })();
    return UiGmapApi;
  }]);

}).call(this);

(function() {
  angular.module('ui-gmap', ['ui-gmap.core', 'ui-gmap.templates', 'ui-gmap.api']);

}).call(this);

(function() {
  angular.module('ui-gmap.debug', []).config(["$logProvider", function($logProvider) {
    return $logProvider.debugEnabled(true);
  }]).config(["$provide", function($provide) {
    $provide.decorator('$log', ["$delegate", function($delegate) {
      var debug;
      if (typeof window.printStackTrace === "function") {
        debug = $delegate['debug'];
        $delegate.trace = function() {
          if ($delegate.traceEnabled) {
            return debug.apply($delegate, arguments);
          }
        };
        ['log', 'info', 'warn', 'debug', 'trace'].map(function(operation) {
          var original;
          original = $delegate[operation];
          return $delegate[operation] = function() {
            var newArgs, stackLine;
            if (console.groupCollapsed != null) {
              console.groupCollapsed.apply(console, arguments);
            }
            original.apply($delegate, arguments);
            stackLine = printStackTrace()[4];
            newArgs = ["$log call source", stackLine.split("@")[1]];
            debug.apply($delegate, newArgs);
            if (console.groupEnd != null) {
              return console.groupEnd();
            }
          };
        });
      }
      return $delegate;
    }]);
    return $provide.decorator('$exceptionHandler', ["$delegate", function($delegate) {
      return function(exception, cause) {
        $delegate(exception, cause);
        throw exception;
      };
      return $delegate;
    }]);
  }]).run(["$log", function($log) {
    return $log.traceEnabled = true;
  }]);

}).call(this);

(function() {
  angular.module('ui-gmap.core', ['ui-gmap.providers']).config(["$provide", function($provide) {
    return $provide.decorator('$log', ["$delegate", function($delegate) {
      if ($delegate.trace == null) {
        $delegate.trace = angular.noop;
      }
      return $delegate;
    }]);
  }]).controller('uiGmapController', ["$scope", "$log", "UiGmapApi", function($scope, $log, UiGmapApi) {
    $log.trace("CONTROLLER: ui-gmap controller defined");
    this.transcludedElements = null;
    this.api = new UiGmapApi(this, $scope.uiGmap);
    return this.registerFeature = (function(_this) {
      return function(feature) {
        $log.trace("REGISTERING: %s is registered.", feature.name);
        return _this.api.addFeature(feature);
      };
    })(this);
  }]).directive('uiGmap', ["$log", "googleMapsApi", function($log, googleMapsApi) {
    var CoreDirective, UiGmapLinker;
    UiGmapLinker = (function() {
      function UiGmapLinker() {
        this.post = function(scope, ele, attrs, uiGmapCtrl, transcludeFunc) {
          $log.trace("LINKING: ui-gmap directive");

          /*
            1.2.x expects syntax like
            var transcludedElements = transcludeFunc(scope, function (teles, scope) { // do your attaching to DOM })
           */
          googleMapsApi.promise.then(function(maps) {
            $log.trace("RESOLVED: ui-gmap notified of google maps api");
            return uiGmapCtrl.api.notifyMapsLoaded(maps);
          });
        };
      }

      return UiGmapLinker;

    })();
    CoreDirective = (function() {
      function CoreDirective() {
        this.restrict = "A";
        this.controller = 'uiGmapController';
        this.replace = true;
        this.scope = {
          'uiGmap': '=',
          'externalScopes': '&?externalScopes'
        };
        this.compile = function() {
          return new UiGmapLinker();
        };
      }

      return CoreDirective;

    })();
    return new CoreDirective();
  }]);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('ui-gmap.feature.map.api', ['ui-gmap.feature']).constant('DEFAULT_MAP_OPTIONS', {
    center: {
      lat: -34.397,
      lng: 150.644
    },
    zoom: 8
  }).factory('MapApi', ["IApi", "DEFAULT_MAP_OPTIONS", "$log", function(IApi, DEFAULT_MAP_OPTIONS, $log) {
    var MapApi;
    MapApi = (function(_super) {
      __extends(MapApi, _super);

      function MapApi(uiGmapCtrl, mapCtrl, api, ele) {
        this.getMap = __bind(this.getMap, this);
        this.setMap = __bind(this.setMap, this);
        this.setOptions = __bind(this.setOptions, this);
        this.getOptions = __bind(this.getOptions, this);
        $log.trace("CONSTRUCTING: map API");
        MapApi.__super__.constructor.call(this, uiGmapCtrl, mapCtrl, api, ele);
        this.options = null;
        this.mapInstance = null;
      }

      MapApi.prototype.getOptions = function() {
        if (this.options != null) {
          return this.options;
        } else {
          return DEFAULT_MAP_OPTIONS;
        }
      };

      MapApi.prototype.setOptions = function(options) {
        $log.trace("SETTING: map options", options);
        if (!(this.options == null)) {
          this.options = {};
        }
        return this.options = angular.extend(DEFAULT_MAP_OPTIONS, this.options, options);
      };

      MapApi.prototype.setMap = function(mapEle) {
        $log.trace("SETTING: map element");
        return this.mapInstance = mapEle;
      };

      MapApi.prototype.getMap = function() {
        return this.mapInstance;
      };

      return MapApi;

    })(IApi);
    return MapApi;
  }]);

}).call(this);

(function() {
  angular.module('ui-gmap.feature.map', ['ui-gmap.feature', 'ui-gmap.feature.map.feature']).directive('uiGmapMap', ["MapFeature", "$log", function(MapFeature, $log) {
    var MapDirective, UiGmapMapLinker;
    UiGmapMapLinker = (function() {
      function UiGmapMapLinker() {
        this.post = function(scope, ele, attrs, uiGmapCtrl) {
          var feature, mapEle, options;
          $log.trace("LINKING: map directive", uiGmapCtrl);
          options = attrs["uiGmapMap"];
          mapEle = ele;
          feature = new MapFeature(uiGmapCtrl, null, mapEle, "map");
        };
      }

      return UiGmapMapLinker;

    })();
    MapDirective = (function() {
      function MapDirective() {
        this.restrict = "A";
        this.require = "uiGmap";
        this.compile = function() {
          return new UiGmapMapLinker();
        };
      }

      return MapDirective;

    })();
    return new MapDirective();
  }]);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('ui-gmap.feature.map.feature', ['ui-gmap.feature', 'ui-gmap.feature.map.api', 'ui-gmap.google-factory']).config(["googleFactoryProvider", function(googleFactoryProvider) {
    return googleFactoryProvider.addFactory("map", {
      create: function(maps, ele, options) {
        return new maps.Map(ele, options);
      },
      update: function(map, options) {
        map.setOptions(options);
        return map;
      }
    });
  }]).factory('MapFeature', ["IFeature", "MapApi", "$log", "googleFactory", function(IFeature, MapApi, $log, googleFactory) {
    var MapFeature;
    MapFeature = (function(_super) {
      __extends(MapFeature, _super);

      function MapFeature() {
        this.createApi = __bind(this.createApi, this);
        this.onMapsLoaded = __bind(this.onMapsLoaded, this);
        this.render = __bind(this.render, this);
        return MapFeature.__super__.constructor.apply(this, arguments);
      }

      MapFeature.prototype.render = function(maps) {
        var mapOptions;
        mapOptions = this.api.getOptions();
        $log.trace("RENDERING: Map with options: ", mapOptions);
        return this.api.setMap(googleFactory.create("map", maps, this.ele[0], mapOptions));
      };

      MapFeature.prototype.onMapsLoaded = function(api, maps) {
        return $log.trace("ADDING: Map Feature API");
      };

      MapFeature.prototype.createApi = function(api) {
        $log.trace("CREATING: Map API", api);
        this.api = new MapApi(this.gmapCtrl, this.ctrl, api, this.ele);
        return this.api;
      };

      return MapFeature;

    })(IFeature);
    return MapFeature;
  }]);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('ui-gmap.feature.markers.api', ['ui-gmap.feature', 'ui-gmap.google-factory', 'lodash']).constant('DEFAULT_MARKERS_CONFIG', {
    watchList: false,
    deepWatch: false,
    options: {}
  }).factory('MarkersApi', ["IApi", "DEFAULT_MARKERS_CONFIG", "$log", "lodash", "googleFactory", function(IApi, DEFAULT_MARKERS_CONFIG, $log, lodash, googleFactory) {
    var MarkersApi;
    MarkersApi = (function(_super) {
      __extends(MarkersApi, _super);

      function MarkersApi(uiGmapCtrl, markersCtrl, api, ele) {
        this.removeMarkers = __bind(this.removeMarkers, this);
        this.addMarkers = __bind(this.addMarkers, this);
        this.setOptions = __bind(this.setOptions, this);
        this.getOptions = __bind(this.getOptions, this);
        $log.trace("CONSTRUCTING: markers API");
        MarkersApi.__super__.constructor.call(this, uiGmapCtrl, markersCtrl, api, ele);
        this.options = DEFAULT_MARKERS_CONFIG.options;
        this.queue = null;
        this.pendingMarkers = [];
        "addMarker removeMarker".split(" ").map((function(_this) {
          return function(singular) {
            return _this[singular] = function(single) {
              return _this[singular + "s"]([single]);
            };
          };
        })(this));
      }

      MarkersApi.prototype.getOptions = function() {
        return this.options;
      };

      MarkersApi.prototype.setOptions = function(options) {
        $log.trace("SETTING: markers options", options);
        if (this.options == null) {
          this.options = {};
        }
        return this.options = angular.extend(DEFAULT_MARKERS_OPTIONS, this.options, options);
      };

      MarkersApi.prototype.addMarkers = function(markers) {
        $log.trace("SETTING: markers element");
        if (markers == null) {
          this.markers = [];
        }
        this.pendingMarkers = lodash.union(this.pendingMarkers, markers);
        this.markers = lodash.union(this.markers, markers);
        return this.markers;
      };

      MarkersApi.prototype.removeMarkers = function(markers) {
        return lodash.pull(this.markers, markers);
      };

      return MarkersApi;

    })(IApi);
    return MarkersApi;
  }]);

}).call(this);

(function() {
  angular.module('ui-gmap.feature.markers', ['ui-gmap.feature', 'ui-gmap.feature.markers.feature']).directive('uiGmapMarkers', ["MarkersFeature", "$log", function(MarkersFeature, $log) {
    var MarkersDirective, UiGmapMarkersLinker;
    UiGmapMarkersLinker = (function() {
      function UiGmapMarkersLinker() {
        this.post = function(scope, ele, attrs, uiGmapCtrl, transcludeFunc) {
          var element, feature, options;
          $log.trace("LINKING: markers directive", uiGmapCtrl);
          options = attrs["uiGmapMarkers"];
          element = transcludeFunc(scope);
          feature = new MarkersFeature(uiGmapCtrl, null, options.list, "markers");
        };
      }

      return UiGmapMarkersLinker;

    })();
    MarkersDirective = (function() {
      function MarkersDirective() {
        this.restrict = "A";
        this.require = "^uiGmap";
        this.transclude = true;
        this.compile = function() {
          return new UiGmapMarkersLinker();
        };
      }

      return MarkersDirective;

    })();
    return new MarkersDirective();
  }]);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  angular.module('ui-gmap.feature.markers.feature', ['ui-gmap.feature', 'ui-gmap.feature.markers.api', 'lodash', 'ui-gmap.google-factory']).config(["googleFactoryProvider", function(googleFactoryProvider) {
    return googleFactoryProvider.addFactory("markers", {
      create: function(maps, options) {
        return new maps.Marker(options);
      },
      update: function(markers, options) {
        markers.setOptions(options);
        return map;
      }
    });
  }]).factory('MarkersFeature', ["IFeature", "MarkersApi", "$log", "lodash", "googleFactory", function(IFeature, MarkersApi, $log, lodash, googleFactory) {
    var MarkersFeature;
    MarkersFeature = (function(_super) {
      __extends(MarkersFeature, _super);

      function MarkersFeature() {
        this.createApi = __bind(this.createApi, this);
        this.onMapsLoaded = __bind(this.onMapsLoaded, this);
        this.render = __bind(this.render, this);
        return MarkersFeature.__super__.constructor.apply(this, arguments);
      }

      MarkersFeature.prototype.render = function(maps, map) {
        var markersOptions;
        markersOptions = this.markersApi.getOptions();
        $log.trace("RENDERING: Markers with options: ", markersOptions);
        this.markersApi.pendingMarkers.map((function(_this) {
          return function(marker) {
            var localMarkerOptions;
            if (marker.options != null) {
              localMarkerOptions = angular.extend(markersOptions, marker.options);
            } else {
              localMarkerOptions = markersOptions;
            }
            if (localMarkerOptions.position == null) {
              localMarkerOptions.position = {
                lat: marker.latitude,
                lng: marker.longitude
              };
            }
            if (localMarkerOptions.map == null) {
              localMarkerOptions.map = _this.api.map.getMap();
            }
            return googleFactory.create("markers", _this.api.maps(), localMarkerOptions);
          };
        })(this));
        return this.api.pendingMarkers = [];
      };

      MarkersFeature.prototype.onMapsLoaded = function(api, maps) {
        this.api = api;
        return $log.trace("ADDING: Markers Feature API");
      };

      MarkersFeature.prototype.createApi = function(api) {
        $log.trace("CREATING: Markers API", api);
        this.markersApi = new MarkersApi(this.gmapCtrl, this.ctrl, api, this.ele);
        return this.markersApi;
      };

      return MarkersFeature;

    })(IFeature);
    return MarkersFeature;
  }]);

}).call(this);

//# sourceMappingURL=maps/angular-google-maps.js.map