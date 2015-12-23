<big><h1 align="center">vquery</h1></big>

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

vQuery is a simple, light-weight, vanilla JS wrapper for jQuery-like syntax. It is currently experimental, so use it at your own risk.

## Install

```sh
npm install --save vquery
```

## Usage

```js
import v from 'vquery'

v(*selector*).*method*(props)
```
## Methods

Currently implementation (and execution) of mimicing jQuery in a light-weight codebase is far from complete. The methods below work like they do with jQuery, except they are just wrappers around ```document.querySelectorAll```, and the associated vanilla JS dom manipulation functions.

*   Implemented

ready(*function*), load(*function*), hide(), show(), remove(), empty(), wrap(), parent(), isEmpty(), next(), addClass(), removeClass(), toggleClass(), hasClass(), attr(), css(), click(), html(), text(), prepend(), append(), contains()

You can return just the node list from a selector by using ```v(*selector*).nodes```, or get the first node with ```v(*selector*).node```.

Like jQuery, you can chain the methods. Example: ```v(*selector*).css({fontWeight: '500'}).show()```

## Known Issues

*   ```addClass``` and ```removeClass``` currently only accept one class parameter, and it can't have a dot in front of the class name, unlike the query selector. This inconsistency is planned on being fixed.
*   ```attr``` does not accept an object.
*   ```hasClass``` and ```contains``` do not block susequent chained methods.
*   ```wrap``` doesn't wrap anything. It only removes the first child.

I am starting to use this in my own projects in order to reduce code clutter. I will keep updating it as I find use for new wrapper functions, but feel free to contribute if you are interested.

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