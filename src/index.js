class V {
  constructor(selector, context={methodHistory: [], selectorHistory: []}){
    if (!(this instanceof V)) {
      return new V(selector);
    }
    if (selector instanceof V) {
      return selector;
    }
    if (selector && selector.nodeName) {
      selector = [selector];
      if (!this.selector) {
        this.selector = selector;
      }
    }

    this.version = '5.0.1';
    this.methodHistory = context.methodHistory;

    if (context.selectorHistory.length === 0) {
      this.selectorHistory = [];
      this.selectorHistory.push(selector);
    } else {
      this.selectorHistory = context.selectorHistory;
    }

    // Utility functions
    this.error = (msg, selector, method, parameters)=>{
      let errMsg = (msg)=>{
        console.error(`vQuery: ${msg}\nAcceptable parameters: v(${selector}).${method}(${parameters})`);
      };
      if (msg === 'undefinedNode') {
        errMsg('Selector is not a valid node.');
      } else if (msg === 'notType') {
        errMsg(`Parameter passed to the ${method} method is not of the type '${parameters}'.`);
      } else {
        errMsg(msg);
      }
    };
    this.isElement = (element)=>{
      return element instanceof Element || element[0] instanceof Element;
    };
    this.queryElement = (element)=>{
      return this.isElement(element) ? element : this.query(document, element)[0];
    };
    this.queryParameter = (param, checkNodes)=>{
      if (checkNodes) {
        return this.nodes ? this.nodes : this.nonElement ? this.nonElement : param;
      } else {
        return this.nonElement ? this.nonElement : param;
      }
    };
    this.assignNodes = (nodes)=>{
      this.nodes = this.slice(nodes);
      this.node = this.nodes.length > 0 ? this.nodes[0] : null;
    };
    this.handler = (data, opts)=>{
      // If the selector is updated, start a new instance with the updated selector.
      let _selector = data ? data : this.selector ? this.selector : selector;
      this.selectorHistory.push(_selector);
      this.methodHistory.push(opts.method);
      return new V(_selector, {
        selectorHistory: this.selectorHistory,
        methodHistory: this.methodHistory
      });
    }
    this.slice = (nodeList)=>{
      return Array.prototype.slice.call(nodeList);
    }

    // Assign the selector by calling this.query if its an element, otherwise assign it to this.nodes directly.
    let isStringElement = null;
    if (selector) {
      if (this.typeOf(selector) === 'string') {
        try {
          isStringElement = selector.match(/<(.|\n)*?>/g)[0];
        } catch (e) {}
        if (isStringElement) {
          this.nonElement = selector;
          this.assignNodes(this.parseHTML(selector));
        } else {
          try {
            this.assignNodes(this.query(document, selector));
          } catch (e) {
            this.nonElement = selector;
          }
        }
        if (!this.node) {
          this.nonElement = selector;
        }
      } else if (isStringElement) {
        this.nonElement = selector;
        this.assignNodes(this.parseHTML(selector))
      } else {
        if (this.isElement(selector)) {
          this.assignNodes(selector);
        } else {
          this.nodes = selector;
          this.node = this.nodes[0];
        }
      }
      this.length = this.nodes ? this.nodes.length : this.nonElement ? this.nonElement.length : 0;
    }
  }
  for(iterator, func){
    if (iterator !== undefined) {
      for (let i = 0, len = iterator.length; i < len; i++) {
        func.apply(this, [iterator[i], i, arguments]);
      }
    }
  }
  forIn (props, func){
    for (let y in props) {
      func.apply(this, [y, props, arguments]);
    }
  }
  includes(string, match){
    return string.indexOf(match) > -1;
  }
  typeOf(input){
    return Object.prototype.toString.call(input).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
  }
  move(fromIndex, toIndex){
    try {
      this.nodes = this.nodes.splice(toIndex, 0, this.nodes.splice(fromIndex, 1)[0]);

      return this.handler(null, {method: 'move'});
    } catch (e) {
      this.error('notType', '', 'move', 'array');
    }
  }
  uniq(array){
    let _array = array ? array : this.nonElement ? this.nonElement : this.nodes ? this.nodes : null;
    let uniq = Array.from(new Set(_array));
    if (array) {
      return uniq;
    } else {
      this.selector = uniq;
      return this.handler(null, {method: 'uniq'});
    }
  }
  // Turn the CSS selector into a node, pass an existing node to this.nodes, which is used by all methods.
  query(el, _selector){
    return el.querySelectorAll(_selector);
  }
  parseHTML(string){
    let tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = this.nonElement ? this.nonElement : string;
    return tmp.body.children;
  }
  mixin(mixin){
    for (var prop in mixin) {
      if (mixin.hasOwnProperty(prop)) {
        V.prototype[prop] = mixin[prop];
      }
      return V.prototype[prop].apply(this, [this.nodes, arguments]);
    }
  }
  ajax(type, url, options){
    var Promise = require('promise-polyfill');
    var setAsap = require('setasap');
    Promise._setImmediateFn(setAsap);
    return new Promise((resolve, reject)=>{
      var _resolve = (data)=>{
        let _data = options && options.chain ? this.handler(data, {method: 'ajax'}) : data;
        if (typeof _data !== 'undefined' && _data) {
          resolve(_data);
        }
      };
      var request = new XMLHttpRequest();
      request.open(type, url, true);
      let data;
      if (type.toLowerCase() === 'post') {
        // Check if options.data is JSON, if not, send as application/x-www-form-urlencoded
        try {
          options.data = JSON.stringify(options.data);
          request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        } catch (e) {
          request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        request.send(options.data);
      }
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          try {
            data = JSON.parse(request.responseText);
          } catch (e) {
            data = request.responseText;
          }
          _resolve(data);
        } else {
          reject();
        }
      };
      if (type.toLowerCase() === 'get') {
        request.send();
      }
      request.onerror = function(err) {
        reject(err);
      };
    });
  }
  // v(selector).get(0) -> <div></div>
  get(i){
    this.selector = this.nodes[i];
    return this.handler(null, {method: 'get'});
  }
  // Event methods
  ready(func){
    if (func && func !== undefined && typeof func === 'function') {
      document.addEventListener('DOMContentLoaded', func);
    } else {
      this.error('notType', '', 'ready', 'function');
    }
  }
  load(func){
    if (func && func !== undefined && typeof func === 'function') {
      document.addEventListener('load', func);
    } else {
      this.error('notType', '', 'load', 'function');
    }
  }
  on(event, func){
    this.for(this.nodes, (i)=>{
      i.addEventListener(event, func);
    });
    return this.handler(null, {method: 'on'});
  }
  off(event, func){
    this.for(this.nodes, (i)=>{
      i.removeEventListener(event, func);
    });
    return this.handler(null, {method: 'off'});
  }
  trigger(event){
    if (this.node.fireEvent) {
      (this.node.fireEvent('on' + event));
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(event, true, false);
      this.node.dispatchEvent(evObj);
    }
    return this.handler(null, {method: 'trigger'});
  }
  click(func){
    this.for(this.nodes, (i)=>{
      if (func) {
        this.on('click', func);
      } else {
        this.trigger('click');
      }
    });
    return this.handler(null, {method: 'click'});
  }
  // DOM traversal and manipulation methods
  filter(func){
    Array.prototype.filter.call(this.nodes, func);
    return this.handler(null, {method: 'filter'});
  }
  each(func){
    Array.prototype.forEach.call(this.nodes, func);
    return this.handler(null, {method: 'each'});
  }
  map(func){
    Array.prototype.map.call(this.nodes, func);
    return this.handler(null, {method: 'map'});
  }
  find(_selector){
    if (!this.isElement(_selector)) {
      if (this.includes(_selector, ',')) {
        let __selector = _selector.split(',');
        let newSelector = [];
        let subset = [];
        this.for(__selector, (i)=>{
          subset = this.query(this.node, i);
          this.for(subset, (y)=>{
            newSelector.push(y);
          });
        });
        this.selector = newSelector;
      } else {
        this.selector = this.query(this.node, _selector);
      }
    } else {
      this.selector = _selector;
    }
    return this.handler(null, {method: 'find'});
  }
  end(){
    this.selector = this.selectorHistory[0];
    return this.handler(null, {method: 'end'});
  }
  hide(){
    this.for(this.nodes, (i)=>{
      i.style.display = 'none';
    });
    return this.handler(null, {method: 'hide'});
  }
  show(){
    this.for(this.nodes, (i)=>{
      i.style.display = 'block';
    });
    return this.handler(null, {method: 'show'});
  }
  remove(){
    this.for(this.nodes, (i)=>{
      i.parentNode.removeChild(i);
    });
    return this.handler(null, {method: 'remove'});
  }
  empty(){
    this.for(this.nodes, (i)=>{
      i.innerHTML = '';
    });
    return this.handler(null, {method: 'empty'});
  }
  clone(){
    var clone = this.node.cloneNode(true);
    this.selector = clone;
    return this.handler(null, {method: 'clone'});
  }
  wrap(tag){
    this.for(this.nodes, (i)=>{
      i.outerHTML = `${tag.match(/<(.|\n)*?>/g)[0]}${i.outerHTML}`;
    });
    return this.handler(null, {method: 'wrap'});
  }
  parent(){
    this.selector = this.node.parentNode;
    return this.handler(null, {method: 'parent'});
  }
  parents(el){
    let parent = this.node.parentNode;
    let _parents = [];
    while (parent) {
      _parents.unshift(parent);
      parent = parent.parentNode;
    }
    if (el) {
      let __parents = [];
      let _parentsQuery = [];
      this.for(_parents, (i)=>{
        __parents = this.slice(this.query(i, el));
        this.for(__parents, (y)=>{
          _parentsQuery.push(y);
        });
      });
      this.selector = this.uniq(_parentsQuery);
    } else {
      this.selector = _parents;
    }
    return this.handler(null, {method: 'parents'});
  }
  children(el){
    let children = this.slice(this.nodes[0].children);
    if (el) {
      let _children = [];
      let arr = [];
      this.for(children, (i)=>{
        _children = this.slice(this.query(i, el));
        this.for(_children, (y)=>{
          arr.push(_children[y]);
        });
      });
      this.selector = arr;
    } else {
      this.selector = children;
    }
    return this.handler(null, {method: 'children'});
  }
  allChildren(_el){
    var __el = _el ? this.slice(this.query(this.node, _el))[0] : this.node;
    var arr = [];
    var recurse = (el)=>{
      arr.push(el);
      if (el.childNodes.length > 0) {
        this.forIn(el.childNodes, (child)=>{
          if (el.childNodes[child].nodeType == 1) {
            recurse(el.childNodes[child]);
          }
        });
      }
    };
    recurse(__el);
    this.selector = arr;
    return this.handler(null, {method: 'allChildren'});
  }
  isEmpty(){
    return !this.node.hasChildNodes();
  }
  siblings(){
    this.nodes = this.node.parentNode.children;
    return this.filter((child)=>{
      return child !== this.node;
    });
  }
  next(){
    this.selector = this.node.nextElementSibling;
    return this.handler(null, {method: 'next'});
  }
  prev(){
    this.selector = this.node.previousElementSibling;
    return this.handler(null, {method: 'prev'});
  }
  addClass(_class){
    var classArr = _class.split(' ');
    this.for(this.nodes, (i)=>{
      this.for(classArr, (y)=>{
        i.classList.add(y);
      });
    });
    return this.handler(null, {method: 'addClass'});
  }
  removeClass(_class){
    var classArr = _class.split(' ');
    this.for(this.nodes, (i)=>{
      this.for(classArr, (y)=>{
        i.classList.remove(y);
      });
    });
    return this.handler(null, {method: 'removeClass'});
  }
  toggleClass(_class){
    var classArr = _class.split(' ');
    this.for(this.nodes, (i)=>{
      this.for(classArr, (y)=>{
        i.classList.toggle(y);
      });
    });
    return this.handler(null, {method: 'toggleClass'});
  }
  hasClass(_class){
    var bool = this.node.classList.contains(_class);
    return bool;
  }
  removeAttr(attr){
    this.for(this.nodes, (i)=>{
      i.removeAttribute(attr);
    });
    return this.handler(null, {method: 'removeAttr'});
  }
  // v(selector).attr() returns an object of camelized attribute keys.
  // v(selector).attr({dataId: '0'}) -> <div data-id="0"></div>
  attr(props, props2){
    let _return = null;
    this.for(this.nodes, (i)=>{
      if (props) {
        if (props2 && this.typeOf(props2) === 'string') {
          i.setAttribute(this.decamelize(props), props2);
          _return = this.handler(null, {method: 'attr'});
        } else {
          this.forIn(props, (y)=>{
            if (this.typeOf(props) === 'string') {
              _return = i.attributes[props].value;
            } else {
              i.setAttribute(this.decamelize(y), props[y]);
              _return = this.handler(null, {method: 'attr'});
            }
          });
        }
      } else {
        var obj = {};
        var name = null;
        var value = null;
        this.for(i.attributes, (z)=>{
          name = this.camelize(z.name);
          value = z.value;
          obj[name] = value;
        });
        _return = obj;
      }
    });
    return _return;
  }
  // v(selector).css({backgroundColor: '#FFF'}) -> <div style="background-color:#FFF;"></div>
  css(props){
    if (props) {
      this.for(this.nodes, (i)=>{
        this.forIn(props, (y)=>{
          i.style[y] = props[y];
        });
      });
      return this.handler(null, {method: 'css'});
    } else {
      if (this.isElement(this.node)) {
        return getComputedStyle(this.node);
      } else {
        return {};
      }
    }
  }
  val(string){
    if (string) {
      this.for(this.nodes, (i)=>{
        i.value = string;
      });
      return this.handler(null, {method: 'val'});
    } else {
      return this.node.value;
    }
  }
  rect(){
    return this.node.getBoundingClientRect();
  }
  offset(){
    let rect = this.rect();
    let offset = {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
    return offset;
  }
  offsetParent(){
    return this.node.offsetParent || this.node;
  }
  height(withMargin){
    let height = this.node.offsetHeight;
    if (withMargin) {
      let style = this.css();
      height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    }
    return height;
  }
  width(withMargin){
    let width = this.node.offsetWidth;
    if (withMargin) {
      let style = this.css();
      width += parseInt(style.marginTop) + parseInt(style.marginBottom);
    }
    return width;
  }
  position(withMargin){
    if (typeof this.node !== 'undefined') {
      return {left: this.node.offsetLeft, top: this.node.offsetTop};
    } else {
      this.error('undefinedNode', 'node', 'position', 'withMargin');
    }
  }
  html(contents){
    var output = [];
    this.for(this.nodes, (i)=>{
      if (!contents) {
        output.push(i.outerHTML);
      } else {
        i.innerHTML = contents;
      }
    });
    return contents ? this.handler(null, {method: 'html'}) : output;
  }
  json(input){
    let _input = this.nodes ? this.nodes : this.nonElement ? this.nonElement : input;
    try {
      return JSON.stringify(_input);
    } catch (e) {
      this.error(e, '', 'json', 'serializable input');
    }
  }
  parseJSON(string){
    string = this.nonElement ? this.nonElement : string;
    try {
      var output = JSON.parse(string);
      return output;
    } catch (e) {
      this.error(e, '', 'parseJSON', 'valid JSON');
    }
  }
  type(input){
    input = this.queryParameter(input, true);
    return this.nodes && this.isElement(this.nodes) ? 'node' : this.typeOf(input);
  }
  replaceWith(string){
    this.for(this.nodes, (i)=>{
      if (string && typeof string === 'string') {
        i.outerHTML = string;
        return this.handler(null, {method: 'replaceWith'});
      } else {
        this.error('notType', '', 'replaceWith', 'string');
      }
    });
  }
  text(contents){
    var output = [];
    this.for(this.nodes, (i)=>{
      if (!contents) {
        output.push(i.textContent);
      } else {
        i.textContent = contents;
      }
    });
    return contents ? this.handler(null, {method: 'text'}) : output;
  }
  insertBefore(el){
    let _element = this.queryElement(el);
    this.for(this.nodes, (i)=>{
      _element.parentNode.insertBefore(i, _element.parentNode.firstChild);
    });
    return this.handler(null, {method: 'insertBefore'});
  }
  insertAfter(el){
    let _element = this.queryElement(el);
    this.for(this.nodes, (i)=>{
      _element.parentNode.insertBefore(i, _element.parentNode.nextSibling);
    });
    return this.handler(null, {method: 'insertAfter'});
  }
  prepend(el){
    let _element = this.queryElement(el);
    this.for(this.nodes, (i)=>{
      i.insertBefore(_element, i.firstChild);
    });
    return this.handler(null, {method: 'prepend'});
  }
  append(el){
    let _element = this.queryElement(el);
    this.for(this.nodes, (i)=>{
      i.appendChild(_element);
    });
    return this.handler(null, {method: 'append'});
  }
  after(string){
    this.for(this.nodes, (i)=>{
      i.insertAdjacentHTML('afterend', string);
    });
    return this.handler(null, {method: 'after'});
  }
  before(string){
    this.for(this.nodes, (i)=>{
      i.insertAdjacentHTML('beforebegin', string);
    });
    return this.handler(null, {method: 'before'});
  }
  contains(text){
    let textContent = null;
    if (this.nonElement) {
      textContent = this.nonElement;
    } else {
      textContent = this.node.textContent;
    }
    var bool = this.includes(this.node.textContent, text);
    return bool;
  }
  is(el){
    let _el = this.queryElement(el);
    return this.node === _el;
  }
  inViewport(){
    var rect = this.rect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  inIframe(){
    try {
      return window.self !== window.top;
    }
    catch (e) {
      return true;
    }
  }
  trim(string){
    string = this.queryParameter(string, true);
    return string.trim();
  }
  // Used by attr method
  camelize(string){
    string = this.queryParameter(string, false);
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '').replace(/[-_]+/g, '');
  }
  decamelize(string){
    string = this.queryParameter(string, false);
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').replace(/^./, function(str){ return str.toLowerCase(); });
  }
  noConflict(){
    var _v = v;
    window.v = window.oldV;
    return _v;
  }

  // Aliases
  get n(){
    return this.node;
  }
  get ns(){
    return this.nodes;
  }
  get ne(){
    return this.nonElement;
  }
}

const v = function(selector){
  return new V(selector);
}

window.v = v;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = v;
}
else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return v;
    });
  }
}