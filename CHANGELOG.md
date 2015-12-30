# Changelog

### v3.1.3

 * Attributes with a "-" character now can be updated by passing an object to ```attr``` with a camel cased property.

### v3.1.2

 * ```attr``` now accepts an object for attr values. If no object is passed, it will return an object of attributes of the currently selected element.
 * New methods added: on(event, function), off(event, function), trigger(event), removeAttr(string), and clone().
 * Add/remove/toggleClass now accept multiple class names separated by spaces.

### v1.0.0

 * vquery initial commit.
