(function(){
  var v = function(selector) {
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
    // Utility functions
    var error = (msg)=>{
      console.error(`vQuery: ${msg}`);
    };
    var isElement = (element)=>{
      return element instanceof Element || element[0] instanceof Element;
    };
    v.prototype.includes = (string, match)=>{
      return string.indexOf(match) > -1;
    };
    v.prototype.typeOf = (input)=>{
      return Object.prototype.toString.call(input).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
    };
    v.prototype.handler = (data)=>{
      // If the selector is updated, start a new instance with the updated selectoreter.
      let _selector = data ? data : this.selector ? this.selector : selector;
      return new v(_selector);
    };
    v.prototype.uniq = (array)=>{
      let _array = array ? array : this.nonElement ? this.nonElement : this.nodes ? this.nodes : null;
      let uniq = Array.from(new Set(_array));
      if (array) {
        return uniq;
      } else {
        this.selector = uniq;
        return this.handler();
      }
    };
    v.prototype.slice = (nodeList)=>{
      return Array.prototype.slice.call(nodeList);
    };
    var assignNodes = (nodes)=>{
      this.nodes = this.slice(nodes);
      this.node = this.nodes[0];
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
        if (typeof this.node === 'undefined') {
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
      this.length = this.nonElement ? this.nonElement.length : this.nodes.length;
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
      return new Promise((resolve, reject)=>{
        var _resolve = (data)=>{
          let _data = options && options.chain ? this.handler(data) : data;
          resolve(_data);
        };
        var request = new XMLHttpRequest();
        request.open(type, url, true);
        let data;
        if (type === 'POST') {
          try {
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send(options.data);
            _resolve(request.responseText);
          } catch (e) {
            reject(e);
          }
        } else {
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
      return this.handler();
    };
    // Event methods
    v.prototype.ready = (func)=>{
      if (func && typeof func !== 'undefined' && typeof func === 'function') {
        document.addEventListener('DOMContentLoaded', func);
      } else {
        error(`Parameter passed to the ready method is not of the type 'function'.`);
      }
    };
    v.prototype.load = (func)=>{
      if (func && typeof func !== 'undefined' && typeof func === 'function') {
        document.addEventListener('onload', func);
      } else {
        error(`Parameter passed to the load method is not of the type 'function'.`);
      }
    };
    v.prototype.on = (event, func)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].addEventListener(event, func);
      }
      return this.handler();
    };
    v.prototype.off = (event, func)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].removeEventListener(event, func);
      }
      return this.handler();
    };
    v.prototype.trigger = (event)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (this.node.fireEvent) {
          (this.node.fireEvent('on' + event));
        } else {
          var evObj = document.createEvent('Events');
          evObj.initEvent(event, true, false);
          this.node.dispatchEvent(evObj);
        }
      }
      return this.handler();
    };
    v.prototype.click = (func)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (func) {
          this.nodes[i].addEventListener('click', func);
        } else {
          v.prototype.trigger('click');
        }
      }
      return this.handler();
    };
    // DOM traversal and manipulation methods
    v.prototype.filter = (func)=>{
      Array.prototype.filter.call(this.nodes, func);
      return this.handler();
    };
    v.prototype.each = (func)=>{
      Array.prototype.forEach.call(this.nodes, func);
      return this.handler();
    };
    v.prototype.map = (func)=>{
      Array.prototype.map.call(this.nodes, func);
      return this.handler();
    };
    v.prototype.find = (_selector)=>{
      if (!isElement(_selector)) {
        if (this.includes(_selector, ',')) {
          let __selector = _selector.split(',');
          let newSelector = [];
          let subset = [];
          for (var i = __selector.length - 1; i >= 0; i--) {
            subset = this.query(this.node, __selector[i]);
            for (var y = subset.length - 1; y >= 0; y--) {
              newSelector.push(subset[y]);
            }
          }
          this.selector = newSelector;
        } else {
          this.selector = this.query(this.node, _selector);
        }
      } else {
        this.selector = _selector;
      }
      return this.handler();
    };
    v.prototype.hide = ()=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].style.display = 'none';
      }
      return this.handler();
    };
    v.prototype.show = ()=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].style.display = 'block';
      }
      return this.handler();
    };
    v.prototype.remove = ()=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].parentNode.removeChild(this.nodes[i]);
      }
      return this.handler();
    };
    v.prototype.empty = ()=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].innerHTML = '';
      }
      return this.handler();
    };
    v.prototype.clone = ()=>{
      var clone = this.node.cloneNode(true);
      this.selector = clone;
      return this.handler();
    };
    v.prototype.wrap = (tag)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].outerHTML = `${tag.match(/<(.|\n)*?>/g)[0]}${this.nodes[i].outerHTML}`;
      }
      return this.handler();
    };
    v.prototype.parent = ()=>{
      this.selector = this.node.parentNode;
      return this.handler();
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
        for (let i = _parents.length - 1; i >= 0; i--) {
          __parents = this.slice(this.query(_parents[i], el));
          for (let y = __parents.length - 1; y >= 0; y--) {
            _parentsQuery.push(__parents[y]);
          }
        }
        this.selector = this.uniq(_parentsQuery);
      } else {
        this.selector = _parents;
      }
      return this.handler();
    };
    v.prototype.children = (el)=>{
      let children = this.slice(this.nodes[0].children);
      if (el) {
        let _children = [];
        let arr = [];
        for (let i = children.length - 1; i >= 0; i--) {
          _children = this.slice(this.query(children[i], el));
          for (let y = _children.length - 1; y >= 0; y--) {
            arr.push(_children[y]);
          }
        }
        this.selector = arr;
      } else {
        this.selector = children;
      }
      return this.handler();
    };
    v.prototype.allChildren = (_el)=> {
      var __el = _el ? this.slice(this.query(this.node, _el))[0] : this.node;
      var arr = [];
      var recurse = (el)=>{
        arr.push(el);
        if (el.childNodes.length > 0) {
          for (var child in el.childNodes) {
            if (el.childNodes[child].nodeType == 1) {
              recurse(el.childNodes[child]);
            }
          }
        }
      };
      recurse(__el);
      this.selector = arr;
      return this.handler();
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
      return this.handler();
    };
    v.prototype.prev = ()=>{
      this.selector = this.node.previousElementSibling;
      return this.handler();
    };
    v.prototype.addClass = (_class)=>{
      var classArr = _class.split(' ');
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        for (var y = 0; y < classArr.length; y++) {
          this.nodes[i].classList.add(classArr[y]);
        }
      }
      return this.handler();
    };
    v.prototype.removeClass = (_class)=>{
      var classArr = _class.split(' ');
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        for (var y = 0; y < classArr.length; y++) {
          this.nodes[i].classList.remove(classArr[y]);
        }
      }
      return this.handler();
    };
    v.prototype.toggleClass = (_class)=>{
      var classArr = _class.split(' ');
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        for (var y = 0; y < classArr.length; y++) {
          this.nodes[i].classList.toggle(classArr[y]);
        }
      }
      return this.handler();
    };
    v.prototype.hasClass = (_class)=>{
      var bool = this.node.classList.contains(_class);
      return bool;
    };
    v.prototype.removeAttr = (attr)=>{   
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].removeAttribute(attr);
      }
      return this.handler();
    };
    // v(selector).attr() returns an object of camelized attribute keys. 
    // v(selector).attr({dataId: '0'}) -> <div data-id="0"></div>
    v.prototype.attr = (props, props2)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (props) {
          if (props2 && this.typeOf(props2) === 'string') {
            this.nodes[i].setAttribute(this.decamelize(props), props2);
          } else {
            for (var y in props) {
              if (this.typeOf(props) === 'string') {
                return this.nodes[i].attributes[props].value;
              } else {
                this.nodes[i].setAttribute(this.decamelize(y), props[y]);
                return this.handler();
              }
            }
          }
        } else {
          var obj = {};
          var name = null;
          var value = null;
          for (var z = this.nodes[i].attributes.length - 1; z >= 0; z--) {
            name = this.camelize(this.nodes[i].attributes[z].name);
            value = this.nodes[i].attributes[z].value;
            obj[name] = value;
          }
          return obj;
        }
      }
    };
    // v(selector).css({backgroundColor: '#FFF'}) -> <div style="background-color:#FFF;"></div>
    v.prototype.css = (props)=>{
      if (props) {
        for (var i = this.nodes.length - 1; i >= 0; i--) {
          for (var y in props) {
            this.nodes[i].style[y] = props[y];
          }
        }
        return this.handler();
      } else {
        return getComputedStyle(this.node);
      }
    };
    v.prototype.val = (string)=>{
      if (string) {
        for (var i = this.nodes.length - 1; i >= 0; i--) {
          this.nodes[i].value = string;
        }
        return this.handler();
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
      return {left: this.node.offsetLeft, top: this.node.offsetTop};
    };
    v.prototype.html = (contents)=>{ 
      var output = [];
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (!contents) {
          output.push(this.nodes[i].innerHTML);
        } else {
          this.nodes[i].innerHTML = contents;
        }
      }
      return contents ? this.handler() : output;
    };
    v.prototype.json = (input)=>{
      let _input = this.nodes ? this.nodes : input;
      let output = JSON.stringify(_input);
      if (output && typeof _input !== 'string') {
        return JSON.stringify(_input);
      } else {
        error(`Parameter passed to the json method cannot be converted into valid JSON.`);
      }
    };
    v.prototype.parseJSON = (string)=>{
      string = this.nonElement ? this.nonElement : string;
      try {
        var output = JSON.parse(string);
      } catch (e) {
        error(`Parameter passed to the parseJSON method is not valid JSON.\n${e}`);
      }
      return output;
    };
    v.prototype.type = (input)=>{
      input = this.nodes ? this.nodes : this.nonElement ? this.nonElement : input;
      return isElement(this.nodes) ? 'node' : this.typeOf(input);
    };
    v.prototype.replaceWith = (string)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (string && typeof string === 'string') {
          this.nodes[i].outerHTML = string;
          return this.handler();
        } else {
          error(`Parameter passed to the replaceWith method is not of the type 'string'.`);
        }
      }
    };
    v.prototype.text = (contents)=>{
      var output = [];
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (!contents) {
          output.push(this.nodes[i].textContent);
        } else {
          this.nodes[i].textContent = contents;
        }
      }
      return contents ? this.handler() : output;
    };
    v.prototype.insertBefore = (el1, el2)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].insertBefore(el1, el2);
      }
      return this.handler();
    };
    v.prototype.prepend = (element)=>{ 
      let _element = isElement(element) ? element : this.query(document, element)[0];
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].insertBefore(_element, this.nodes[i].firstChild);
      }
      return this.handler();
    };
    v.prototype.append = (element)=>{ 
      let _element = isElement(element) ? element : this.query(document, element)[0];
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].appendChild(_element);
      }
      return this.handler();
    };
    v.prototype.after = (string)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].insertAdjacentHTML('afterend', string);
      }
      return this.handler();
    };
    v.prototype.before = (string)=>{
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].insertAdjacentHTML('beforebegin', string);
      }
      return this.handler();
    };
    v.prototype.replaceWith = (contents)=>{ 
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].outerHTML = contents;
      }
      return this.handler();
    };
    v.prototype.contains = (text)=>{
      let textContent = null;
      if (this.nonElement) {
        textContent = this.nonElement;
      } else {
        textContent = this.node.textContent;
      }
      var bool = this.includes(textContent, text);
      return bool;
    };
    v.prototype.is = (el)=>{
      let _el = isElement(el) ? el : this.query(document, el)[0];
      return this.node === _el;
    };
    v.prototype.trim = (string)=>{
      string = this.nonElement ? this.nonElement : string;
      return string.trim();
    };
    // Used by attr method
    v.prototype.camelize = (string)=>{
      string = this.nonElement ? this.nonElement : string;
      return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '').replace(/[-_]+/g, '');
    };
    v.prototype.decamelize = (string)=>{
      string = this.nonElement ? this.nonElement : string;
      return string
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3')
        .replace(/^./, function(str){ return str.toLowerCase(); });
    };
    v.prototype = {
      get n(){
        return this.node;
      },
      get ns(){
        return this.nodes;
      }
    };
  };
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = v;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return v;
      });
    }
    else {
      window.v = v;
    }
  }
})();