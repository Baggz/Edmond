// Načteme Edmonda
var Edmond = require('../src/edmond.js');
var myRouter = new Edmond();

/**
 * Test route matching
 */
exports['Test route matching'] = function(test) {
  
  // Vytvoříme si novou instanci Edmonda  
  var myRouter1 = new Edmond();

  var a = 1;

  var fn1 = function(request) {
    test.equal(request.route, '/users/');
    a++;
  };

  var fn2 = function(request) {
    test.equal(request.route, '/users/:id');
    a++;
  };

  var fn3 = function(request) {
    test.equal(request.route, '/users/:id/:action');
    a++;
  };

  myRouter1.addRoute('/users/', fn1);
  myRouter1.addRoute('/users/:id', fn2);
  myRouter1.addRoute('/users/:id/:action', fn3);

  myRouter1.dispatchRoute('/users/');
  myRouter1.dispatchRoute('/users/123');
  myRouter1.dispatchRoute('/users/123/delete');

  test.equal(a, 4);
  test.done();

};

/**
 * Test ‘request.params’
 */
exports['Test ‘request.params’'] = function(test) {

  var a = 1;
  myRouter.addRoute('/users/:id', function(request) {
    test.equal(request.params.id, 123);
    a++;
  });

  [
    '/users/123',
    '/users/123/',
    '/users/123?a=b',
    '/users/123/?a=b',
    '/users/123#a',
    '/users/123/#a',
    '/users/123?a=b#a',
    '/users/123/?a=b#a'
  ].forEach(function(route) {
    myRouter.dispatchRoute(route);
  });

  test.equal(a, 9);


  var b =1;

  myRouter.addRoute('/users/:id/:action', function(request) {
    test.equal(request.params.id, 123);
    test.equal(request.params.action, 'delete');
    b++;
  });

  [
    '/users/123/delete',
    '/users/123/delete/',
    '/users/123/delete?a=b',
    '/users/123/delete/?a=b',
    '/users/123/delete#a',
    '/users/123/delete/#a',
    '/users/123/delete?a=b#a',
    '/users/123/delete/?a=b#a'    
  ].forEach(function(route) {
    myRouter.dispatchRoute(route);
  });

  test.equal(b, 9);
  test.done();

};

/**
 * Test ‘request.query’
 */
exports['Test ‘request.query’'] = function(test) {

  myRouter.addRoute('/users/:id', function(request) {
    test.equal(request.query.a, 'b');
  });

  [
    '/users/123?a=b',
    '/users/123/?a=b',
    '/users/123?a=b#a',
    '/users/123/?a=b#a'
  ].forEach(function(route) {
    myRouter.dispatchRoute(route);
  });

  test.done();

};

/**
 * Test ‘request.hash’
 */
exports['Test ‘request.hash’'] = function(test) {

  myRouter.addRoute('/users/:id', function(request) {
    test.equal(request.hash, 'a');
  });


  [
    '/users/123?a=b#a',
    '/users/123/?a=b#a',
    '/users/123/#a',
    '/users/123#a'
  ].forEach(function(route) {
    myRouter.dispatchRoute(route);
  });

  test.done();

};

/**
 * Test ‘Edmond.on’
 */
exports['Test ‘Edmond.on’'] = function(test) {

  var c = 1;
  myRouter.on('error', function() {
    c++;
  });

  [
    '/nonexisting/123?a=b#a',
    '/asd/?a=b#a',
    '/usadsadrs/123/#a'
  ].forEach(function(route) {
    myRouter.dispatchRoute(route);
  });

  test.equal(c, 4);
  test.done();

};