(function() {

  /**
   * List of event listeners
   *
   * @private
   */
  var listeners = {};

  /**
   * DispatchEvent
   *
   * @param {string} type
   */
  var dispatchEvent = function(type, message) {
    var eventListeners = listeners[type] || [];
    for (var i = 0, len= eventListeners.length; i < len; i++) {
      eventListeners[i](message);
    }
  };

  /**
   * Edmond
   *
   * @constructor
   */
  var Edmond = function() {

    // This is where all the routes live
    this.routes = [];

  };

  /**
   * AddRoute
   *
   * @param {string} route
   */
  Edmond.prototype.addRoute = function(route) {

    var fns = Array.prototype.slice.call(arguments, 1),
        tokenRe = /:([A-Za-z0-9_]+)/g;

    // Look for tokens
    var tokenMatches = route.match(tokenRe) || [];

    // Remove ‘:’ at the beginning
    var tokens = tokenMatches.map(function(token) {
      return token.slice(1);
    });

    var routeRe = '^';

    routeRe += route.replace(tokenRe, '([^/?#]+)');

    routeRe += '\/?';               // Optional back slash
    routeRe += '(?:\\?([^#]+))?';   // Querystring
    routeRe += '(?:\\#(.+))?';      // Hash
    routeRe += '$';                 // End

    // Save
    this.routes.push({
      tokens: tokens,
      fns: fns,
      re: new RegExp(routeRe),
      route: route
    });

  };

  /**
   * DispatchRoute
   *
   * @param {string} location
   */
  Edmond.prototype.dispatchRoute = function(path) {

    // Fire all event listeners
    dispatchEvent('dispatch', {
      path: path
    });

    // The choosen route
    var route = null,
        routes = this.routes;

    // Match the route
    for (var i = 0, len = routes.length; i < len; i++) {
      if ( path.match( routes[i].re ) ) {
        route = routes[i];
        break;
      }
    }

    // If route was not found
    if ( !route ) {
      return dispatchEvent('error', {
        path: path,
        error: 404
      });
    }

    /**
     * Request
     */
    var request = {
      params: {},
      query: {},
      path: path,
      route: route.route
    };

    var matches = path.match(route.re);

    var tokensValues = matches.slice(1, route.tokens.length + 1),
        queryString = matches.slice(-2, -1)[0],
        hashString = matches.slice(-1)[0];
    
    // Request.params
    tokensValues.forEach(function(tokenValue, index) {
      var tokenName = route.tokens[index];
      request.params[tokenName] = tokenValue;
    });

    // QueryString
    if (queryString) {
      queryString = queryString.split('&');
      queryString.forEach(function(chunk) {
        chunk = chunk.split('=');
        request.query[chunk[0]] = chunk[1] || true;
      });
    }

    request.hash = hashString;

    // Vygenerujeme frontu
    var queue = route.fns.map(function(fn, index) {
      return function() {

        var next = function(error) {
          var fn = queue[index++];

          if ( error ) {
            return dispatchEvent('error', error);
          }

          if (fn) {
            return fn;
          }

        };

        return fn(request, next);

      };
    });

    // And goo!
    queue[0]();

  };

  /**
   * On
   *
   * @param {string} event
   * @param {function} listener
   */
  Edmond.prototype.on = function(event, listener) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    return listeners[event].push(listener);
  };

  // Export
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = Edmond;
  } else if ( typeof define !== 'undefined' ) {
    define(function() {
      return Edmond;
    });
  } else {
    this.Edmond = Edmond;
  }

}());