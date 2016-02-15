# Changelog

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
