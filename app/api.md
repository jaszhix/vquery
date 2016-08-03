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

[Download](https://raw.githubusercontent.com/jaszhix/vquery/master/v.min.js) it from the repository, or you can use a CDN. 

* [JSDelivr](http://www.jsdelivr.com/projects/vquery)
* [cdnjs](https://cdnjs.com/libraries/vquery)

```html
<script src="v.min.js"></script>
```
### Experiment with vQuery Now
You can open up the developer console on this page and start testing the methods documented below.

### vQuery Portal

There is now a [hub](https://neuropuff.com/c/vquery) that will aggregate all vQuery resources across the web.

[Break]
The methods below work like they do with jQuery, except they are just wrappers around ```document.querySelectorAll```, and the associated vanilla JS dom manipulation functions.

Like jQuery and many other similar libraries, most of the methods can be chained.
[Break]
### Node retrieval
[Break]

#### v(CSS selector|Element|String|Array|Object)
The selector parameter can accept a DOM node, an array of DOM nodes, a CSS selector, or any other type as long as the methods called on it support it.

For more information on the CSS selector, read MDN's documentation on [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll).

If a node, node list, or an array of nodes is passed to this parameter, ```querySelectorAll``` is not called, and the nodes are passed directly to the constructor instance.
```js
v('.class');
v('#id');
v('div');
v(document.getElementById('id'));
```

Most methods will iterate over a node array so every element selected is affected by the method. Some methods which only act on a single node will use ```.node``` instead, or the first node in the array. You can get around this by calling ```.get(index)```.
[Break]
#### .nodes (Alias: .ns)
Stores the array of nodes queried by the selector. vQuery will always slice a nodelist into an array before returning it.
```js
v('.class-thing').nodes (Alias: .ns)
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
Returns the first node in the array of nodes.
```js
v('.class-thing').node;
```
```html
-> <div class="class-thing">One</div>
```
[Break]
#### .nonElement (Alias: .ne)
If a non selector string is passed to the selector parameter, calling ```.nonElement``` will retrieve it. Most of the utility methods that do not affect the DOM will check for this namespace first.
```js
v('This string is not an element').nonElement;
-> "This string is not an element"
```
[Break] 
#### .get(index)
Returns a node from an array of nodes at a given index passed to its parameter. ```.get(0)``` is the same as ```.node```, except that it is chainable.
```js
v('.class-thing').get(1).n;
```
```html
-> <div class="class-thing">Two</div>
```
[Break] 
#### .find(CSS selector|Element)
Queries the selected array of nodes.
```js
v('.class-thing').get(2).find('#three').node
```
```html
-> <span id="three">Three</span>
```
[Break] 
#### .end()
Retrieves the original selector after a sequence of methods have been chained.
```js
v('#main').find('p').css({color: '#eee'}).attr({name: 'paragraph'}).end().n
```
```html
-> <div id="main">...</div>
```
[Break] 
#### .length
Returns the length of the array of nodes.
```js
v('.class-thing').length
-> 2
```
[Break]
### Events
[Break] 
#### .ready(function)
Invokes the function passed to its parameter after the document is ready.
```js
v().ready(()=>{
  console.log('Document is ready!');
});
```
[Break] 
#### .load(function)
Invokes the function passed to its parameter after the document has loaded.
```js
v().load(()=>{
  console.log('Document has loaded!');
});
```
[Break]
#### .on(event, function)
Attaches an event listener at the selected node.
```js
v('#animating-div').on('animationend', myAnimationFunction);
```
[Break] 
#### .off(event, function)
Detaches an event listener at the selected node.
```js
v(document.getElementById('animating-div')).off('animationend', myAnimationFunction);
```
[Break] 
#### .trigger(event)
Triggers an event passed to its parameter.
```js
v(document.getElementById('animating-div')).trigger('click');
```
[Break] 
#### .click(function)
Alias to ```.on('click', function)```.
```js
v('body > div.pre-render').click(myCleverClickEvent);
```
[Break]
### Iteration
[Break] 
#### .for(Iterator, Function)
An alias to a reverse iterating, length caching, for loop. This method wraps the for loop in a function, and can be easier to type. For loops are currently the fastest way to iterate an array in Javascript.
```js
v().for(items, (item, i)=>{
  item = `This is the same as items[i] inside a for loop.`
});
```
[Break] 
#### .forIn(Props, Function)
An alias to a standard for in loop for iterating objects.
```js
v().forIn(object, (i)=>{
  keys.push(i);
  values.push(object[i]);
});
```
[Break] 
#### .filter(function(currentValue, index, array))
Wrapper around the native Array.prototype.filter function.
```js
v('div').filter((el, i, a)=>{
  console.log(v(el).n);
});
```
[Break] 
#### .each(function(currentValue, index, array))
Wrapper around the native Array.prototype.forEach function.
```js
v('div').each((el, i, a)=>{
  console.log(v(el).n);
});
```
[Break] 
#### .map(function(currentValue, index, array))
Wrapper around the native Array.prototype.map function.
```js
v('div').map((el, i, a)=>{
  console.log(v(el).n);
});
```
[Break]
### DOM Manipulation
[Break] 
#### .hide()
Hides DOM nodes selected by the CSS selector or element passed to the selector parameter. It is a wrapper for ```element.style.display = 'none'```.
[Break] 
#### .show()
Shows DOM nodes selected by the CSS selector or element passed to the selector parameter. It is a wrapper for ```element.style.display = 'block'```.
[Break] 
#### .remove()
Removes all selected nodes.
[Break] 
#### .clone()
Clones a node.
```js
var clone = v('.node-to-clone').clone();
v('.parent-node').insertBefore(clone, v('.node-to-clone').n)
```
[Break] 
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
#### .siblings()
Returns an array of sibling nodes.
[Break] 
#### .next()
Returns the next sibling node.
[Break] 
#### .prev()
Returns the previous sibling node.
[Break] 
#### .addClass(Classes)
Adds classes from a space separated string of classes passed to its parameter on all selected nodes.
[Break] 
#### .removeClass(String)
Removes classes from a space separated string of classes passed to its parameter on all selected nodes.
[Break] 
#### .toggleClass(String)
Toggles classes from a space separated string of classes passed to its parameter on all selected nodes.
[Break] 
#### .hasClass(String)
Returns ```true``` or ```false``` if a selected node has a class.
[Break] 
#### .removeAttr(String)
Removes an attribute from all selected nodes.
[Break] 
#### .attr(Object|String|Key, Value)
Pass an object of camel cased attribute keys, or a key/value pair of strings to set attribute(s). Calling the method without a parameter will return an object of the selected element's attributes.
[Break] 
#### .css(object)
Pass an object of camel cased style keys, or pass no parameter to return the computed style of the selected element.
[Break] 
#### .rect()
Returns the position of an object relative of the viewport.
[Break] 
#### .offset()
```js
v('#main > div > div:nth-child(2) > div.col-xs > div:nth-child(7) > div > div > div > div > pre:nth-child(4)').offset()
-> Object {top: 1697, left: 327}
```
[Break] 
#### .offsetParent()
Returns the offset parent.
[Break] 
#### .height(Boolean)
Returns the outer height of an element. Passing ```true``` will return the outer height with margin.
[Break] 
#### .width(Boolean)
Returns the outer width of an element. Passing ```true``` will return the outer width with margin.
[Break] 
#### .position()
Returns the position of an element.
```js
v('#main > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div > div:nth-child(31) > span').position()
-> Object {left: 161, top: 1511}
```
[Break] 
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
#### .replaceWith(HTML string)
Replaces the selected element with a parsed HTML string passed to its parameter.
[Break]
#### .text(String)
Inserts text inside the selected elements, or returns an array of text strings inside the selected elements if no parameter is passed.
[Break] 
#### .val(String)
Passing a string to its parameter changes the value of the selected element, or returns the current value of the selected element if no parameter is passed.
[Break] 
#### .insertBefore(newNode, referenceNode)
Works like the native Node.insertBefore method as it is just a wrapper. The selector parameter must be a parent of the newNode and referenceNode.
[Break] 
#### .prepend(CSS selector or Element)
Prepends all selected nodes to the selector or element passed to its parameter.
[Break] 
#### .append(CSS selector or Element)
Appends all selected nodes to the selector or element passed to its parameter.
[Break] 
#### .after(HTML string)
Returns a node from a string passed to its parameter, and inserts it after the selected node.
[Break] 
#### .before(HTML string)
Returns a node from a string passed to its parameter, and inserts it before the selected node.
[Break] 
#### .contains(element or string)
Returns ```true``` or ```false``` if the selected node contains an element passed to its parameter, or if the inner text contains a string if a string is passed to its parameter.
[Break]
#### .is(CSS selector or Element)
Compares two elements and returns ```true``` if they are the same, and ```false``` if not.
[Break]
#### .isEmpty()
Returns ```true``` or ```false``` if a node is empty.
[Break]
#### .inViewport()
Returns ```true``` or ```false``` if a node is inside the viewport.
[Break]
#### .inIframe()
Returns ```true``` or ```false``` if the current document is inside an iframe.
[Break]
### Utilities
[Break]
#### .ajax(POST|GET, URL, options.data|options.chain)
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
-> true
```
Example using jQuery:

```js
v(':header').mixin({$:$})
```
```html
-> [<h3 id=​"install-using-npm">​Install Using NPM​</h3>​, <h3 id=​"install-using-the-browser">​Install Using The Browser​</h3>​, <h3 id=​"experiment-with-vquery-now">​Experiment with vQuery Now​</h3>​, <h3 id=​"breaking-changes-in-4-3-0">​Breaking changes in 4.3.0​</h3>​,...]
```
[Break] 
#### .uniq(array)
Returns a duplicate free version of an array, or an array of nodes. The array can be passed to the selector parameter or its own.
[Break]
#### .move(indexes)
Moves an item in an array to and from the specified indexes.
```js
var x = v([1,2,3]).move(2,0).ns;
x[0]
-> 3
```
[Break] 
#### .type(value)
Returns the ```typeof``` operator string of the unevaluated operand. Passing an element to its parameter will return ```"node"```. The parameter can be passed to the selector parameter or its own.
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
#### .includes(String, Match)
Similar to ```.contains()``` except it can check if any string is matched by its second parameter.
[Break]
#### .trim(String)
```js
v('   trimMe!   ').trim();
v().trim('   trimMe!   ');
-> 'trimMe!'
```
[Break] 
#### .camelize(String)
```js
v('data-id').camelize();
v().camelize('data-id');
-> 'dataId'
```
[Break] 
#### .decamelize(String)
```js
v('deCamelize').decamelize()
v().decamelize('deCamelize')
-> 'de-Camelize'
```