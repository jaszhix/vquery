(function(){
  window.oldV = window.v;
  var v = function(selector, context={methodHistory: [], selectorHistory: []}) {
    if (!(this instanceof v)) {
      return new v(selector);
    } 
    if (selector instanceof v) {
      return selector;
    }
    if (selector && selector.nodeName) {
      selector = [selector];
      if (!this.selector) {
        this.selector = selector;
      }
    }

    this.version = '4.7.0';
    this.methodHistory = context.methodHistory;

    if (context.selectorHistory.length === 0) {
      this.selectorHistory = [];
      this.selectorHistory.push(selector);
    } else {
      this.selectorHistory = context.selectorHistory;
    }
    
    // Utility functions
    var error = (msg, selector, method, parameters)=>{
      var errMsg = (msg)=>{
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
    var isElement = (element)=>{
      return element instanceof Element || element[0] instanceof Element;
    };
    var queryElement = (element)=>{
      return isElement(element) ? element : this.query(document, element)[0];
    };
    var queryParameter = (param, checkNodes)=>{
      if (checkNodes) {
        return this.nodes ? this.nodes : this.nonElement ? this.nonElement : param;
      } else {
        return this.nonElement ? this.nonElement : param;
      }
    };
    v.prototype.for = (iterator, func)=>{
      if (iterator !== undefined) {
        for (let i = 0, len = iterator.length; i < len; i++) {
          func.apply(this, [iterator[i], i, arguments]);
        }
      }
    };
    v.prototype.forIn = (props, func)=>{
      for (let y in props) {
        func.apply(this, [y, props, arguments]);
      }
    };
    v.prototype.includes = (string, match)=>{
      return string.indexOf(match) > -1;
    };
    v.prototype.typeOf = (input)=>{
      return Object.prototype.toString.call(input).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
    };
    v.prototype.handler = (data, opts)=>{
      // If the selector is updated, start a new instance with the updated selector.
      let _selector = data ? data : this.selector ? this.selector : selector;
      this.selectorHistory.push(_selector);
      this.methodHistory.push(opts.method);
      return new v(_selector, {
        selectorHistory: this.selectorHistory,
        methodHistory: this.methodHistory
      });
    };
    v.prototype.move = (fromIndex, toIndex)=>{
      try {
        this.nodes.splice(toIndex, 0, this.nodes.splice(fromIndex, 1)[0]);
        return this.handler(null, {method: 'move'});
      } catch (e) {
        error('notType', '', 'move', 'array');
      }
    },
    v.prototype.uniq = (array)=>{
      let _array = array ? array : this.nonElement ? this.nonElement : this.nodes ? this.nodes : null;
      let uniq = Array.from(new Set(_array));
      if (array) {
        return uniq;
      } else {
        this.selector = uniq;
        return this.handler(null, {method: 'uniq'});
      }
    };
    v.prototype.slice = (nodeList)=>{
      return Array.prototype.slice.call(nodeList);
    };
    var assignNodes = (nodes)=>{
      this.nodes = this.slice(nodes);
      this.node = this.nodes.length > 0 ? this.nodes[0] : null;
    };
    // Turn the CSS selector into a node, pass an existing node to this.nodes, which is used by all methods.
    v.prototype.query = (el, _selector)=>{
      return el.querySelectorAll(_selector);
    };
    v.prototype.parseHTML = (string)=>{
      let tmp = document.implementation.createHTMLDocument();
      tmp.body.innerHTML = this.nonElement ? this.nonElement : string;
      return tmp.body.children;
    };
    // Assign the selector by calling this.query if its an element, otherwise assign it to this.nodes directly.
    if (selector) {
      if (this.typeOf(selector) === 'string') {
        try {
          assignNodes(this.query(document, selector));
        } catch (e) {
          try {
            if (selector.match(/<(.|\n)*?>/g)[0]) {
              this.nonElement = selector;
              assignNodes(this.parseHTML(selector));
            }
          } catch (y) {
            this.nonElement = selector;
          }

        }
        if (!this.node) {
          this.nonElement = selector;
        }
      } else {
        if (isElement(selector)) {
          assignNodes(selector);
        } else {
          this.nodes = selector;
          this.node = this.nodes[0];
        }
      }
      this.length = this.nodes ? this.nodes.length : this.nonElement ? this.nonElement.length : 0;
    }
    v.prototype.mixin = (mixin)=>{
      for (var prop in mixin) {
        if (mixin.hasOwnProperty(prop)) {
          v.prototype[prop] = mixin[prop];
        }
        return v.prototype[prop].apply(this, [this.nodes, arguments]);
      } 
    };
    v.prototype.ajax = (type, url, options)=>{
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
    };
    // v(selector).get(0) -> <div></div>
    v.prototype.get = (i)=>{
      this.selector = this.nodes[i];
      return this.handler(null, {method: 'get'});
    };
    // Event methods
    v.prototype.ready = (func)=>{
      if (func && func !== undefined && typeof func === 'function') {
        document.addEventListener('DOMContentLoaded', func);
      } else {
        error('notType', '', 'ready', 'function');
      }
    };
    v.prototype.load = (func)=>{
      if (func && func !== undefined && typeof func === 'function') {
        document.addEventListener('load', func);
      } else {
        error('notType', '', 'load', 'function');
      }
    };
    v.prototype.on = (event, func)=>{
      this.for(this.nodes, (i)=>{
        i.addEventListener(event, func);
      });
      return this.handler(null, {method: 'on'});
    };
    v.prototype.off = (event, func)=>{
      this.for(this.nodes, (i)=>{
        i.removeEventListener(event, func);
      });
      return this.handler(null, {method: 'off'});
    };
    v.prototype.trigger = (event)=>{
      if (this.node.fireEvent) {
        (this.node.fireEvent('on' + event));
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(event, true, false);
        this.node.dispatchEvent(evObj);
      }
      return this.handler(null, {method: 'trigger'});
    };
    v.prototype.click = (func)=>{
      this.for(this.nodes, (i)=>{
        if (func) {
          this.on('click', func);
        } else {
          this.trigger('click');
        }
      });
      return this.handler(null, {method: 'click'});
    };
    // DOM traversal and manipulation methods
    v.prototype.filter = (func)=>{
      Array.prototype.filter.call(this.nodes, func);
      return this.handler(null, {method: 'filter'});
    };
    v.prototype.each = (func)=>{
      Array.prototype.forEach.call(this.nodes, func);
      return this.handler(null, {method: 'each'});
    };
    v.prototype.map = (func)=>{
      Array.prototype.map.call(this.nodes, func);
      return this.handler(null, {method: 'map'});
    };
    v.prototype.find = (_selector)=>{
      if (!isElement(_selector)) {
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
    };
    v.prototype.end = ()=>{
      this.selector = this.selectorHistory[0];
      return this.handler(null, {method: 'end'});
    };
    v.prototype.hide = ()=>{
      this.for(this.nodes, (i)=>{
        i.style.display = 'none';
      });
      return this.handler(null, {method: 'hide'});
    };
    v.prototype.show = ()=>{
      this.for(this.nodes, (i)=>{
        i.style.display = 'block';
      });
      return this.handler(null, {method: 'show'});
    };
    v.prototype.remove = ()=>{
      this.for(this.nodes, (i)=>{
        i.parentNode.removeChild(i);
      });
      return this.handler(null, {method: 'remove'});
    };
    v.prototype.empty = ()=>{
      this.for(this.nodes, (i)=>{
        i.innerHTML = '';
      });
      return this.handler(null, {method: 'empty'});
    };
    v.prototype.clone = ()=>{
      var clone = this.node.cloneNode(true);
      this.selector = clone;
      return this.handler(null, {method: 'clone'});
    };
    v.prototype.wrap = (tag)=>{
      this.for(this.nodes, (i)=>{
        i.outerHTML = `${tag.match(/<(.|\n)*?>/g)[0]}${i.outerHTML}`;
      });
      return this.handler(null, {method: 'wrap'});
    };
    v.prototype.parent = ()=>{
      this.selector = this.node.parentNode;
      return this.handler(null, {method: 'parent'});
    };
    v.prototype.parents = (el)=>{
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
    };
    v.prototype.children = (el)=>{
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
    };
    v.prototype.allChildren = (_el)=> {
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
    };
    v.prototype.isEmpty = ()=>{
      return !this.node.hasChildNodes();
    };
    v.prototype.siblings = ()=>{
      this.nodes = this.node.parentNode.children;
      return this.filter((child)=>{
        return child !== this.node;
      });
    };
    v.prototype.next = ()=>{
      this.selector = this.node.nextElementSibling;
      return this.handler(null, {method: 'next'});
    };
    v.prototype.prev = ()=>{
      this.selector = this.node.previousElementSibling;
      return this.handler(null, {method: 'prev'});
    };
    v.prototype.addClass = (_class)=>{
      var classArr = _class.split(' ');
      this.for(this.nodes, (i)=>{
        this.for(classArr, (y)=>{
          i.classList.add(y);
        });
      });
      return this.handler(null, {method: 'addClass'});
    };
    v.prototype.removeClass = (_class)=>{
      var classArr = _class.split(' ');
      this.for(this.nodes, (i)=>{
        this.for(classArr, (y)=>{
          i.classList.remove(y);
        });
      });
      return this.handler(null, {method: 'removeClass'});
    };
    v.prototype.toggleClass = (_class)=>{
      var classArr = _class.split(' ');
      this.for(this.nodes, (i)=>{
        this.for(classArr, (y)=>{
          i.classList.toggle(y);
        });
      });
      return this.handler(null, {method: 'toggleClass'});
    };
    v.prototype.hasClass = (_class)=>{
      var bool = this.node.classList.contains(_class);
      return bool;
    };
    v.prototype.removeAttr = (attr)=>{
      this.for(this.nodes, (i)=>{
        i.removeAttribute(attr);
      });
      return this.handler(null, {method: 'removeAttr'});
    };
    // v(selector).attr() returns an object of camelized attribute keys. 
    // v(selector).attr({dataId: '0'}) -> <div data-id="0"></div>
    v.prototype.attr = (props, props2)=>{
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
    };
    // v(selector).css({backgroundColor: '#FFF'}) -> <div style="background-color:#FFF;"></div>
    v.prototype.css = (props)=>{
      if (props) {
        this.for(this.nodes, (i)=>{
          this.forIn(props, (y)=>{
            i.style[y] = props[y];
          });
        });
        return this.handler(null, {method: 'css'});
      } else {
        if (isElement(this.node)) {
          return getComputedStyle(this.node);
        } else {
          return {};
        }
      }
    };
    v.prototype.val = (string)=>{
      if (string) {
        this.for(this.nodes, (i)=>{
          i.value = string;
        });
        return this.handler(null, {method: 'val'});
      } else {
        return this.node.value;
      }
    };
    v.prototype.rect = ()=>{
      return this.node.getBoundingClientRect();
    };
    v.prototype.offset = ()=>{ 
      let rect = this.rect();
      let offset = {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
      return offset;
    };
    v.prototype.offsetParent = ()=>{
      return this.node.offsetParent || this.node;
    };
    v.prototype.height = (withMargin)=>{
      let height = this.node.offsetHeight;
      if (withMargin) {
        let style = this.css();
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
      }
      return height;
    };
    v.prototype.width = (withMargin)=>{
      let width = this.node.offsetWidth;
      if (withMargin) {
        let style = this.css();
        width += parseInt(style.marginTop) + parseInt(style.marginBottom);
      }
      return width;
    };
    v.prototype.position = (withMargin)=>{
      if (typeof this.node !== 'undefined') {
        return {left: this.node.offsetLeft, top: this.node.offsetTop};
      } else {
        error('undefinedNode', 'node', 'position', 'withMargin');
      }
    };
    v.prototype.html = (contents)=>{ 
      var output = [];
      this.for(this.nodes, (i)=>{
        if (!contents) {
          output.push(i.outerHTML);
        } else {
          i.innerHTML = contents;
        }
      });
      return contents ? this.handler(null, {method: 'html'}) : output;
    };
    v.prototype.json = (input)=>{
      let _input = this.nodes ? this.nodes : this.nonElement ? this.nonElement : input;
      try {
        return JSON.stringify(_input);
      } catch (e) {
        error(e, '', 'json', 'serializable input');
      }
    };
    v.prototype.parseJSON = (string)=>{
      string = this.nonElement ? this.nonElement : string;
      try {
        var output = JSON.parse(string);
        return output;
      } catch (e) {
        error(e, '', 'parseJSON', 'valid JSON');
      }
    };
    v.prototype.type = (input)=>{
      input = queryParameter(input, true);
      return this.nodes && isElement(this.nodes) ? 'node' : this.typeOf(input);
    };
    v.prototype.replaceWith = (string)=>{
      this.for(this.nodes, (i)=>{
        if (string && typeof string === 'string') {
          i.outerHTML = string;
          return this.handler(null, {method: 'replaceWith'});
        } else {
          error('notType', '', 'replaceWith', 'string');
        }
      });
    };
    v.prototype.text = (contents)=>{
      var output = [];
      this.for(this.nodes, (i)=>{
        if (!contents) {
          output.push(i.textContent);
        } else {
          i.textContent = contents;
        }
      });
      return contents ? this.handler(null, {method: 'text'}) : output;
    };
    v.prototype.insertBefore = (el1, el2)=>{
      this.for(this.nodes, (i)=>{
        i.insertBefore(el1, el2);
      });
      return this.handler(null, {method: 'insertBefore'});
    };
    v.prototype.prepend = (el)=>{ 
      let _element = queryElement(el);
      this.for(this.nodes, (i)=>{
        i.insertBefore(_element, i.firstChild);
      });
      return this.handler(null, {method: 'prepend'});
    };
    v.prototype.append = (el)=>{ 
      let _element = queryElement(el);
      this.for(this.nodes, (i)=>{
        i.appendChild(_element);
      });
      return this.handler(null, {method: 'append'});
    };
    v.prototype.after = (string)=>{
      this.for(this.nodes, (i)=>{
        i.insertAdjacentHTML('afterend', string);
      });
      return this.handler(null, {method: 'after'});
    };
    v.prototype.before = (string)=>{
      this.for(this.nodes, (i)=>{
        i.insertAdjacentHTML('beforebegin', string);
      });
      return this.handler(null, {method: 'before'});
    };
    v.prototype.contains = (text)=>{
      let textContent = null;
      if (this.nonElement) {
        textContent = this.nonElement;
      } else {
        textContent = this.node.textContent;
      }
      var bool = this.includes(this.node.textContent, text);
      return bool;
    };
    v.prototype.is = (el)=>{
      let _el = queryElement(el);
      return this.node === _el;
    };
    v.prototype.inViewport = ()=>{
      var rect = this.rect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };
    v.prototype.inIframe = ()=>{
      try {
        return window.self !== window.top;
      }
      catch (e) {
        return true;
      }
    };
    v.prototype.trim = (string)=>{
      string = queryParameter(string, true);
      return string.trim();
    };
    // Used by attr method
    v.prototype.camelize = (string)=>{
      string = queryParameter(string, false);
      return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '').replace(/[-_]+/g, '');
    };
    v.prototype.decamelize = (string)=>{
      string = queryParameter(string, false);
      return string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').replace(/^./, function(str){ return str.toLowerCase(); });
    };
    v.prototype.noConflict = ()=>{
      var _v = v;
      window.v = window.oldV;
      return _v;
    };
    // Aliases
    v.prototype = {
      get n(){
        return this.node;
      },
      get ns(){
        return this.nodes;
      },
      get ne(){
        return this.nonElement;
      }
    };
  };
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
})();