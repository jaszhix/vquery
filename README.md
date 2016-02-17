<p align="center">
  <a href="http://jaszhix.github.io/vquery/">
    <img src="http://jaszhix.github.io/vquery/app/assets/images/logo.png" alt="vQuery">
  </a>
</p>
<p align="center">
  <a href="https://npmjs.org/package/vquery">
    <img src="https://img.shields.io/npm/v/vquery.svg?style=flat-square"
         alt="NPM Version">
  </a>
  <a href="https://travis-ci.org/jaszhix/vquery">
    <img src="https://img.shields.io/travis/jaszhix/vquery.svg?style=flat-square"
         alt="Build Status">
  </a>

  <a href="https://npmjs.org/package/vquery">
    <img src="http://img.shields.io/npm/dm/vquery.svg?style=flat-square"
         alt="Downloads">
  </a>

  <a href="https://david-dm.org/jaszhix/vquery.svg">
    <img src="https://david-dm.org/jaszhix/vquery.svg?style=flat-square"
         alt="Dependency Status">
  </a>

  <a href="https://github.com/jaszhix/vquery/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/vquery.svg?style=flat-square"
         alt="License">
  </a>
</p>

<p align="center"><big>

</big></p>

vQuery is a simple, light-weight, vanilla JS wrapper for jQuery-like syntax.

## Install Using NPM

```sh
npm install --save vquery
```
```js
import v from 'vquery'

v(selector, element, or string).method(props);
```

## Install Using The Browser

[Download](https://raw.githubusercontent.com/jaszhix/vquery/master/v.min.js) it from the repository or use the [JSDelivr CDN](http://www.jsdelivr.com/projects/vquery).

```html
<script src="v.min.js"></script>
```

### API

The methods below work like they do with jQuery, except they are just wrappers around ```document.querySelectorAll```, and the associated vanilla JS dom manipulation functions.

Like jQuery and many other similar libraries, most of the methods can be chained.

**Breaking changes in 4.0.0**: ```.nodes()``` is now ```nodes``` and ```node()``` is now ```node```.

Below are a few methods available. For the complete API documentation, visit the [vQuery website](http://jaszhix.github.io/vquery/).

### Node retrieval

*   .nodes *
```js
v('.class-thing').nodes
```
```html
->  [
    <div class="class-thing">One</div>, 
    <div class="class-thing">Two</div>, 
    <div class="class-thing"><span id="three">Three</span></div>
    ]
```

*   .node (Alias: .n) *
```js
v('.class-thing').node;
```
```html
-> <div class="class-thing">One</div>
```

*   .get(index)
```js
v('.class-thing').get(1).n;
```
```html
-> <div class="class-thing">Two</div>
```

*   .find(CSS selector)
```js
v('.class-thing').get(2).find('#three').node
```
```html
-> <span id="three">Three</span>
```

*   .length *
```js
v('.class-thing').length
-> 2
```

*   .click(function)
```js
v('body > div.pre-render').click(myCleverClickEvent);
```

*   .children(CSS selector)
  * Returns an array of child nodes, or filters child nodes if a CSS selector parameter is passed to it.

*   .allChildren(CSS selector)
  * Like .children(), it returns an array of child nodes, but instead of returning just the first level of children, it deeply recurses every child node and returns an array of every element under the selected node at all levels of children.

*   .attr(object)
  * Pass an object of camel cased attribute keys, or pass no parameter to return an object of existing attributes.

*   .css(object)
  * Pass an object of camel cased style keys, or pass no parameter to return the computed style of the selected element.

* .ajax(POST|GET, URL, options.data|options.chain)
  * AJAX request method returning a Promise. Set options.chain to ```true``` to pass the data through vQuery's context.
```js
v().ajax('GET', 'https://myawesome.net/api/request/').then((data)=>{
  // Do something with the data.
}).catch((err)=>{
  // Do something with the error.
});
v().ajax('GET', 'https://myawesome.net/api/request/', {chain: true}).then((data)=>{
  console.log(data.nodes);
-> {...}
  console.log(data.type());
-> 'object'
}).catch((err)=>{
  // Do something with the error.
});
```

* .mixin(object)
  * This method allows you to pass vQuery's returned result to another library. The mixin should be at the end of the method chain.
  * Example using Lodash:
```js
v([]).mixin({_:_}).isArray();
-> true
```
  * Example using jQuery:
```js
v(':empty').mixin({$: $});
```
```html
-> <meta charset="utf-8">
```

## To-do's
*   Package vQuery for Bower
*   Cross-browser testing


<!-- [npm-url]: https://npmjs.org/package/vquery
[npm-image]: https://img.shields.io/npm/v/vquery.svg?style=flat-square

[travis-url]: https://travis-ci.org/jaszhix/vquery
[travis-image]: https://img.shields.io/travis/jaszhix/vquery.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/jaszhix/vquery
[coveralls-image]: https://img.shields.io/coveralls/jaszhix/vquery.svg?style=flat-square

[depstat-url]: https://david-dm.org/jaszhix/vquery
[depstat-image]: https://david-dm.org/jaszhix/vquery.svg?style=flat-square

[download-badge]: http://img.shields.io/npm/dm/vquery.svg?style=flat-square
 -->