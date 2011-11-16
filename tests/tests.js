// Načteme Edmonda
var edmond = require('../src/edmond.js');

/**
 * Test route matching
 */
exports['Test route matching'] = function(test) {

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

  edmond.addRoute('/users/', fn1);
  edmond.addRoute('/users/:id', fn2);
  edmond.addRoute('/users/:id/:action', fn3);

  edmond.dispatchRoute('/users/');
  edmond.dispatchRoute('/users/123');
  edmond.dispatchRoute('/users/123/delete');

  test.equal(a, 4);
  test.done();

};

/**
 * Test ‘request.params’
 */
exports['Test ‘request.params’'] = function(test) {

  var a = 1;
  edmond.addRoute('/posts/:id', function(request) {
    test.equal(request.params.id, 123);
    a++;
  });

  [
    '/posts/123',
    '/posts/123/',
    '/posts/123?a=b',
    '/posts/123/?a=b',
    '/posts/123#a',
    '/posts/123/#a',
    '/posts/123?a=b#a',
    '/posts/123/?a=b#a'
  ].forEach(function(route) {
    edmond.dispatchRoute(route);
  });

  test.equal(a, 9);


  var b =1;

  edmond.addRoute('/articles/:id/:action', function(request) {
    test.equal(request.params.id, 123);
    test.equal(request.params.action, 'delete');
    b++;
  });

  [
    '/articles/123/delete',
    '/articles/123/delete/',
    '/articles/123/delete?a=b',
    '/articles/123/delete/?a=b',
    '/articles/123/delete#a',
    '/articles/123/delete/#a',
    '/articles/123/delete?a=b#a',
    '/articles/123/delete/?a=b#a'    
  ].forEach(function(route) {
    edmond.dispatchRoute(route);
  });

  test.equal(b, 9);
  test.done();

};

/**
 * Test ‘request.query’
 */
exports['Test ‘request.query’'] = function(test) {

  edmond.addRoute('/commits/:id', function(request) {
    test.equal(request.query.a, 'b');
  });

  [
    '/commits/123?a=b',
    '/commits/123/?a=b',
    '/commits/123?a=b#a',
    '/commits/123/?a=b#a'
  ].forEach(function(route) {
    edmond.dispatchRoute(route);
  });

  test.done();

};

/**
 * Test ‘request.hash’
 */
exports['Test ‘request.hash’'] = function(test) {

  edmond.addRoute('/tasks/:id', function(request) {
    test.equal(request.hash, 'a');
  });


  [
    '/tasks/123?a=b#a',
    '/tasks/123/?a=b#a',
    '/tasks/123/#a',
    '/tasks/123#a'
  ].forEach(function(route) {
    edmond.dispatchRoute(route);
  });

  test.done();

};

/**
 * Test ‘Edmond.on’
 */
exports['Test ‘Edmond.on’'] = function(test) {

  var c = 1;
  edmond.on('error', function() {
    c++;
  });

  [
    '/nonexisting/123?a=b#a',
    '/asd/?a=b#a',
    '/usadsadrs/123/#a'
  ].forEach(function(route) {
    edmond.dispatchRoute(route);
  });

  test.equal(c, 4);
  test.done();

};