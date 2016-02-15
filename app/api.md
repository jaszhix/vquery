vQuery is a simple, light-weight, vanilla JS wrapper for jQuery-like syntax.

### Install Using NPM


```sh
npm install --save vquery
```
```js
import v from 'vquery'

v(selector, element, or string).method(props);
```

### Install Using The Browser

[Download](https://raw.githubusercontent.com/jaszhix/vquery/master/v.min.js) it from the repository or use the [JSDelivr CDN](http://www.jsdelivr.com/projects/vquery).

```html
<script src="v.min.js"></script>
```
### Experiment with vQuery Now
You can open up the developer console on this page and start testing the methods documented below.
[Break]
The methods below work like they do with jQuery, except they are just wrappers around ```document.querySelectorAll```, and the associated vanilla JS dom manipulation functions.

Like jQuery and many other similar libraries, most of the methods can be chained.

**Breaking changes in 4.0.0**: ```.nodes()``` is now ```nodes``` and ```node()``` is now ```node```.
[Break]
### Node retrieval
[Break] 
#### .nodes
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
[Break] 
#### .node (Alias: .n)
```js
v('.class-thing').node;
```
```html
-> <div class="class-thing">One</div>
```
[Break] 
#### .get(index)
```js
v('.class-thing').get(1).n;
```
```html
-> <div class="class-thing">Two</div>
```
[Break] 
#### .find(CSS selector)
```js
v('.class-thing').get(2).find('#three').node
```
```html
-> <span id="three">Three</span>
```
[Break] 
#### .length
```js
v('.class-thing').length
-> 2
```
[Break]
### Events
[Break] 
#### .ready(function)
```js
v().ready(()=>{
  console.log('Document is ready!');
});
```
[Break] 
#### .load(function)
```js
v().load(()=>{
  console.log('Document has loaded!');
});
```
[Break] 
#### .on(event, function)
```js
v('#animating-div').on('animationend', myAnimationFunction);
```
[Break] 
#### .off(event, function)
```js
v(document.getElementById('animating-div')).off('animationend', myAnimationFunction);
```
[Break] 
#### .trigger(event)
```js
v(document.getElementById('animating-div')).trigger('click');
```
[Break] 
#### .click(function)
```js
v('body > div.pre-render').click(myCleverClickEvent);
```
[Break]
### Iteration
[Break] 
#### .filter(function(currentValue, index, array))[Break] 
#### .each(function(currentValue, index, array))[Break] 
#### .map(function(currentValue, index, array))
[Break]
### DOM Manipulation
[Break] 
#### .hide()[Break] 
#### .show()[Break] 
#### .remove()[Break] 
#### .clone()[Break] 
#### .wrap(HTML string)
```js
v('.class-thing').get(0).wrap('<span id="one" />').parent().n;
```
```html
-> <span id="one"><div class="class-thing">Two</div></span>
```
[Break] 
#### .parent(CSS selector)
Returns the parent node.
[Break] 
#### .parents(CSS selector)
Returns an array of all parent nodes, or filters all parent nodes if a CSS selector parameter is passed to it.
[Break] 
#### .children(CSS selector)
Returns an array of child nodes, or filters child nodes if a CSS selector parameter is passed to it.
[Break] 
#### .allChildren(CSS selector)
Like .children(), it returns an array of child nodes, but instead of returning just the first level of children, it deeply recurses every child node and returns an array of every element under the selected node at all levels of children.
[Break] 
#### .isEmpty()[Break] 
#### .siblings()[Break] 
#### .next()[Break] 
#### .prev()[Break] 
#### .addClass(string of classes separated by a space)[Break] 
#### .removeClass(string of classes separated by a space)[Break] 
#### .addClass(string of classes separated by a space)[Break] 
#### .hasClass(string)[Break] 
#### .removeAttr(string)[Break] 
#### .attr(object)
Pass an object of camel cased attribute keys, or pass no parameter to return an object of existing attributes.
[Break] 
#### .css(object)
Pass an object of camel cased style keys, or pass no parameter to return the computed style of the selected element.
[Break] 
#### .rect()
Returns the position of an object relative of the viewport.
[Break] 
#### .offset()[Break] 
#### .offsetParent()[Break] 
#### .outerHeight()[Break] 
#### .outerWidth()[Break] 
#### .position()[Break] 
#### .html(HTML string)
Inserts HTML inside the selected elements, or returns an array of HTML strings of the selected elements if no parameter is passed.
[Break] 
#### .parseHTML(HTML string)
```js
v('<div class="stuff"></div>').parseHTML();
v().parseHTML('<div class="stuff"></div>');
```
```html
-> <div class="stuff"></div>
```
[Break] 
#### .text(string)
Inserts text inside the selected elements, or returns an array of text strings inside the selected elements if no parameter is passed.
[Break] 
#### .insertBefore(newNode, referenceNode)
Works like the native Node.insertBefore method as it is just a wrapper. The selector parameter must be a parent of the newNode and referenceNode.
[Break] 
#### .prepend(CSS selector or element)[Break] 
#### .append(CSS selector or element)[Break] 
#### .after(HTML string)[Break] 
#### .before(HTML string)[Break] 
#### .contains(element or string)[Break] 
#### .is(CSS selector or element)
Compares two elements and returns ```true``` if they are the same and ```false``` if not.
[Break]
### Utilities
[Break]
#### .ajax(POST|GET, URL, options.chain)
AJAX request method returning a Promise. Set options.chain to ```true``` to pass the data through vQuery's context.
```js
v().ajax('get', 'https://myawesome.net/api/request/').then((data)=>{
  // Do something with the data.
}).catch((err)=>{
  // Do something with the error.
});
v().ajax('get', 'https://myawesome.net/api/request/', {chain: true}).then((data)=>{
  console.log(data.nodes);
-> {...}
  console.log(data.type());
-> 'object'
}).catch((err)=>{
  // Do something with the error.
});
```
[Break]
#### .mixin(object)
This method allows you to pass vQuery's returned result to another library. The mixin should be at the end of the method chain.
Example using Lodash:

```js
v([]).mixin({_:_}).isArray();
->
```
Example using jQuery:

```js
v(':empty').mixin({$: $});
```
```html
-> <meta charset="utf-8">
```
[Break] 
#### .uniq(array)
[Break] 
#### .type(value)
[Break] 
#### .json(value)
```js
v([{one: true}, {two: false}]).json();
v().json([{one: true}, {two: false}]);
-> '[{"one":true},{"two":false}]'
```
[Break] 
#### .parseJSON(valid JSON string)
```js
v('[{"one":true},{"two":false}]').parseJSON();
v().parseJSON('[{"one":true},{"two":false}]');
-> [{one: true}, {two: false}]
```
[Break] 
#### .trim(string)
```js
v('   trimMe!   ').trim();
v().trim('   trimMe!   ');
-> 'trimMe!'
```
[Break] 
#### .camelize(string)
```js
v('data-id').camelize();
v().camelize('data-id');
-> 'dataId'
```
[Break] 
#### .decamelize(string)
```js
v('deCamelize').decamelize()
v().decamelize('deCamelize')
-> 'de-Camelize'
```