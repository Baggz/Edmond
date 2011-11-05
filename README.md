# Edmond

Edmond is simple JavaScript router for web applications. Although Edmond was originally designed for use in the browser, it can also be used with Node.js.

### Features

* Edmond has **no dependencies**
* **AMD compatible**, you can load it via [RequireJS](https://github.com/jrburke/requirejs)
* Ultra lightweight, **under 1 KB**
* Fully **documented**

## Quick Start

1. Create a new instance of Edmond

    ```javascript
    var myRouter = new Edmond();
    ```

2. Add a new route

    ```javascript
    myRouter.addRoute('/users/:id', function(request) {

      // Do something...

    });
    ```

3. Listen to the ‘error’ event

    ```javascript
    myRouter.on('error', function(message) {

      // Do something...

    });
    ```

4. Dispatch the route

    ```javascript
    myRouter.dispatchRoute('/users/123');
    ```

    *Please see the [Tips](#tips) section for more information about implementing HTML5 history.*

## Download

Releases are available for download from GitHub.

| **Version** | **Description** | **Size** | **Action** |
|:------------|:----------------|:---------|:-----------|
| `edmond.js` | *uncompressed, with comments* | 1 KB | [Download](https://raw.github.com/Baggz/Edmond/master/src/edmond.js |
| `edmond.min.js` | *compressed, without comments* | 1 KB | [Download](https://raw.github.com/Baggz/Edmond/master/dist/edmond.min.js) |

<a name="tips"></a>
# Tips

## HTML5 History

1. First of all, we need to add a new event listener

    ```javascript
    window.addEventListener('popState', function() {
      myRouter.dispatchRoute(window.location.pathname);
    });
    ```

2. Secondly, add a new event listener to the `dispatch` event

    ```javascript
    myRouter.on('dispatch', function(path) {
      history.pushState({}, null, path);
    });
    ```

# Documentation

**Methods**

* [addRoute](#addRoute)
* [dispatchRoute](#dispatchRoute)
* [on](#on)

**Objects**

* [request](#request)

<a name="addRoute"></a>
## AddRoute

### addRoute(route, fn1[, fn2, fn3, ...])

In `route` you can use placeholders (*for instance `:username`*) which are then available as `request.params`.

The callback `fn` gets two arguments `request` and `next` where `request` is a `request` object (see [request](#request) for more information) and the second argument `next` allows you to move to the next callback (if defined).

**Example**

```javascript
myRouter.addRoute('/users/:username', function(request, next) {

  alert('Hello ' + request.username + '!');

});
```

<a name="dispatchRoute"></a>
## DispatchRoute

### dispatchRoute(path)

**Example**

```javascript
myRouter.dispatchRoute('/users/123/delete');
```

<a name="on"></a>
## On

### on(event, listener)

**Events**

* `error`
* `dispatch`

**Example**

```javascript
myRouter.on('error', function(message) {

  // Do something...

});
```

<a name="request"></a>
## Request

```javascript
{
  params: {
    ...
  },
  query: {
    ...
  },
  path: ...
  hash: ...
}
```

**Example**

```javascript
{
  params: {
    id: 123,
    action: 'delete'
  },
  query: {
    filter: 'recent'
  },
  path: '/users/123/delete?filter=recent#top'
  hash: '#top'
}
```

# Running Tests

```
$ npm tests/
```

# License

(The MIT License)

Copyright (c) 2011 František Hába &lt;hello@frantisekhaba.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.