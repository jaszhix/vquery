<big><h1 align="center">vQuery</h1></big>

<p align="center">
  <a href="https://npmjs.org/package/vquery">
    <img src="https://img.shields.io/npm/v/vquery.svg?style=flat-square"
         alt="NPM Version">
  </a>

<!--   <a href="https://coveralls.io/r/jaszhix/vquery">
  <img src="https://img.shields.io/coveralls/jaszhix/vquery.svg?style=flat-square"
       alt="Coverage Status">
</a> -->

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

## Install

```sh
npm install --save vquery
```

## Usage

```js
import v from 'vquery'

v(selector, element, or string).method(props);
```
## API

The methods below work like they do with jQuery, except they are just wrappers around ```document.querySelectorAll```, and the associated vanilla JS dom manipulation functions.

Like jQuery and many other similar libraries, most of the methods can be chained.

**Breaking changes in 4.0.0**: ```.nodes()``` is now ```nodes``` and ```node()``` is now ```node```.

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

### Events

*   .ready(function) *
```js
v().ready(()=>{
  console.log('Document is ready!');
});
```

*   .load(function) *
```js
v().load(()=>{
  console.log('Document has loaded!');
});
```

*   .on(event, function)
```js
v('#animating-div').on('animationend', myAnimationFunction);
```

*   .off(event, function)
```js
v(document.getElementById('animating-div')).off('animationend', myAnimationFunction);
```

*   .trigger(event) *
```js
v(document.getElementById('animating-div')).trigger('click');
```

*   .click(function)
```js
v('body > div.pre-render').click(myCleverClickEvent);
```

### Iteration

*   .filter(function(currentValue, index, array))
*   .each(function(currentValue, index, array))
*   .map(function(currentValue, index, array))

### DOM Manipulation

*   .hide()
*   .show()
*   .remove()
*   .clone()
*   .wrap(HTML string)
```js
v('.class-thing').get(0).wrap('<span id="one" />').parent().n;
```
```html
-> <span id="one"><div class="class-thing">Two</div></span>
```

*   .parent(CSS selector)
  * Returns the parent node.

*   .parents(CSS selector)
  * Returns an array of all parent nodes, or filters all parent nodes if a CSS selector parameter is passed to it.

*   .children(CSS selector)
  * Returns an array of child nodes, or filters child nodes if a CSS selector parameter is passed to it.

*   .allChildren(CSS selector)
  * Like .children(), it returns an array of child nodes, but instead of returning just the first level of children, it deeply recurses every child node and returns an array of every element under the selected node at all levels of children.

*   .isEmpty() *
*   .siblings()
*   .next()
*   .prev()
*   .addClass(string of classes separated by a space)
*   .removeClass(string of classes separated by a space)
*   .addClass(string of classes separated by a space)
*   .hasClass(string)
*   .removeAttr(string)
*   .attr(object)
  * Pass an object of camel cased attribute keys, or pass no parameter to return an object of existing attributes.

*   .css(object)
  * Pass an object of camel cased style keys, or pass no parameter to return the computed style of the selected element.

*   .rect() *
  * Returns the position of an object relative of the viewport.

*   .offset() *
*   .offsetParent() *
*   .outerHeight() *
*   .outerWidth() *
*   .position() *
*   .html(HTML string)
  * Inserts HTML inside the selected elements, or returns an array of HTML strings of the selected elements if no parameter is passed.

*   .parseHTML(HTML string) *
```js
v('<div class="stuff"></div>').parseHTML();
v().parseHTML('<div class="stuff"></div>');
```
```html
-> <div class="stuff"></div>
```
*   .text(string)
  * Inserts text inside the selected elements, or returns an array of text strings inside the selected elements if no parameter is passed.

*   .insertBefore(newNode, referenceNode)
  * Works like the native Node.insertBefore method as it is just a wrapper. The selector parameter must be a parent of the newNode and referenceNode.

*   .prepend(CSS selector or element)
*   .append(CSS selector or element)
*   .after(HTML string)
*   .before(HTML string)
*   .contains(element or string)
*   .is(CSS selector or element)
  * Compares two elements and returns ```true``` if they are the same and ```false``` if not.

### Utilities

*   .uniq(array)

*   .type(value)

*   .json(value)
```js
v([{one: true}, {two: false}]).json();
v().json([{one: true}, {two: false}]);
-> '[{"one":true},{"two":false}]'
```

*   .parseJSON(valid JSON string)
```js
v('[{"one":true},{"two":false}]').parseJSON();
v().parseJSON('[{"one":true},{"two":false}]');
-> [{one: true}, {two: false}]
```

*   .trim(string)
```js
v('   trimMe!   ').trim();
v().trim('   trimMe!   ');
-> 'trimMe!'
```

*   .camelize(string)
```js
v('data-id').camelize();
v().camelize('data-id');
-> 'dataId'
```

*   .decamelize(string)
```js
v('deCamelize').decamelize()
v().decamelize('deCamelize')
-> 'de-Camelize'
```

* Asterisked methods are currently not chainable.

## To-do's
*   Package vQuery for Bower and the browser


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