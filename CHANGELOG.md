# Changelog

### v5.0.0
 * Refactored code and converted it into an ES2015 class.
 * ```insertBefore``` now works like it does in jQuery. This will break existing code relying on this method.
 * Added ```insertAfter```.

### v4.7.0
 * The ```for``` method now forward iterates. This may break code relying on it previously iterating backwards.
 * New method
   * ```.noConflict()```

### v4.6.0
 * Passing a serializable input to the selector parameter can now be passed to the ```json``` method.
 * ```.node``` and its alias ```.n``` will now return ```null``` if no elements are selected instead of ```undefined```.
 * New methods
   * ```.inIframe()```
   * ```.move()```

### v4.5.1
 * Fixed the ```load``` method.
 * Improved error messages for debugging.
 * Cross browser support: Added Promise polyfill for the ```ajax``` method.
 * Added tests for ```ajax``` method.

### v4.5.0
 * New method
   * ```.inViewport()```

### v4.4.1
 * The ```for``` method callback now has a second argument for the loop's index.
```js
v().for(items, (item, i)=>{
   // Do stuff
});
```
 * The AJAX method now can accept an object when using the POST method.

### v4.4.0
 * Updated the ```.attr()``` method so it is still chainable while passing a pair of key/value strings.
 * New methods
   * ```.end()```
   * ```.for(Iterator, Function)```
   * ```.forIn(Props, Function)```

### v4.3.1
 * Cleaned up duplicate method ```.replaceWith```.

### v4.3.0
 * Breaking change: Renamed ```.outerHeight()``` and ```.outerWidth()``` to ```.height()``` and ```.width()```, respectively in order to bring more syntactic consistency with jQuery.
 * Breaking change: Updated ```.html()``` to return the outerHTML of an element instead of the innerHTML. Passing an HTML string to its parameter still sets the selected elements innerHTML.
 * Updated ```.attr()``` method to return an attribute's value if a single string is passed to its parameter instead of an object.
 * Updated ```.find()``` to accept a comma separated list of selectors, and be able to return an array of the selected elements.
 * New methods
   * ```.replaceWith(HTML String)```
   * ```.includes(String, Match)```
   * ```.val(String)```

### v4.2.2

 * Fixed ```.ajax()```` method not being able to POST a data object.

### v4.2.1

 * Updated mixin method to pass the array of nodes to the chained library.

### v4.2.0

 * ```.uniq()``` now accepts the selector parameter as well as its own parameter. If uniq is called with the selector parameter only, its array will be passed to a new constructor instance, and will be chainable.
 * ```.find()``` now accepts an element as well as a CSS selector.
 * ```.trigger()``` is now chainable.
 * New methods
   * ```.ajax(GET|POST, URL, options.chain)```
   * ```.mixin(object)```

### v4.1.0

 * Added browser compatibility.
 * Added a minified build intended for being included in script tag in the root of the repository.
 * ```.children()``` now accepts a CSS selector in its parameter and can further filter down the child nodes.
 * New methods
   * ```.parents(CSS selector)```
   * ```.allChildren(CSS selector)```
   * ```.uniq(array)```

### v4.0.0

 * Refactored the library so it uses a constructor instead of returning an object of methods.
 * The selector parameter is now more versatile for some methods as outlined in the API section of the readme.
 * .wrap() works now.
 * Changed the node retrieval from a function to an array. ```.nodes()``` is now ```nodes``` and ```node()``` is now ```node```. ```node``` also has a short alias, ```n```.
 * .length will return the length of the array of selected elements.
 * New methods
   * ```.filter(function(currentValue, index, array))```
   * ```.each(function(currentValue, index, array))```
   * ```.map(function(currentValue, index, array))```
   * ```.siblings()```
   * ```.rect()```
   * ```.offset()```
   * ```.offsetParent()```
   * ```.outerHeight()```
   * ```.outerWidth()```
   * ```.parseHTML(HTML string)```
   * ```.after(HTML string)```
   * ```.before(HTML string)```
   * ```.json(value)```
   * ```.parseJSON(valid JSON string)```
   * ```.trim(string)```
   * ```.type(value)```

### v3.1.3

 * Attributes with a "-" character now can be updated by passing an object to ```attr``` with a camel cased property.

### v3.1.2

 * ```attr``` now accepts an object for attr values. If no object is passed, it will return an object of attributes of the currently selected element.
 * New methods added: on(event, function), off(event, function), trigger(event), removeAttr(string), and clone().
 * Add/remove/toggleClass now accept multiple class names separated by spaces.

### v1.0.0

 * vquery initial commit.
