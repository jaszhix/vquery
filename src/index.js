var V = function(selector) {
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
  // Utility functions
  var error = (msg)=>{
    console.error(`vQuery: ${msg}`);
  };
  var isElement = (element)=>{
    return element instanceof Element || element[0] instanceof Element;
  };
  this.typeOf = (input)=>{
    return Object.prototype.toString.call(input).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
  };
  this.handler = ()=>{
    // If the selector is updated, start a new instance with the updated selectoreter.
    let _selector = this.selector ? this.selector : selector;
    return new V(_selector);
  };
  var assignNodes = (nodes)=>{
    this.nodes = nodes;
    this.node = this.nodes[0];
  };
  // Turn the CSS selector into a node, pass an existing node to this.nodes, which is used by all methods.
  this.query = (el, _selector)=>{
    return el.querySelectorAll(_selector);
  };
  // Assign the selector by calling this.query if its an element, otherwise assign it to this.nodes directly.
  if (selector) {
    if (this.typeOf(selector) === 'string') {
      try {
        assignNodes(Array.prototype.slice.call(this.query(document, selector)));
      } catch (e) {
        this.string = selector;
      }
      if (typeof this.node === 'undefined') {
        this.string = selector;
      }
    } else {
      if (isElement(selector)) {
        assignNodes(Array.prototype.slice.call(selector));
      } else {
        this.nodes = selector;
      }
    }
    this.length = this.string ? this.string.length : this.nodes.length;
  }
  // V(selector).get(0) -> <div></div>
  this.get = (i)=>{
    this.selector = this.nodes[i];
    return this.handler();
  };
  // Event methods
  V.prototype.ready = (func)=>{
    if (func && typeof func !== 'undefined' && typeof func === 'function') {
      document.addEventListener('DOMContentLoaded', func);
    } else {
      error(`Parameter passed to the ready method is not of the type 'function'.`);
    }
  };
  V.prototype.load = (func)=>{
    if (func && typeof func !== 'undefined' && typeof func === 'function') {
      document.addEventListener('onload', func);
    } else {
      error(`Parameter passed to the load method is not of the type 'function'.`);
    }
  };
  V.prototype.on = (event, func)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].addEventListener(event, func);
    }
    return this.handler();
  };
  V.prototype.off = (event, func)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].removeEventListener(event, func);
    }
    return this.handler();
  };
  V.prototype.trigger = (event)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      if (this.nodes[i].fireEvent) {
        (this.nodes[i].fireEvent('on' + event));
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(event, true, false);
        this.nodes[i].dispatchEvent(evObj);
      }
    }
  };
  V.prototype.click = (func)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      if (func) {
        this.nodes[i].addEventListener('click', func);
      } else {
        V.prototype.trigger('click');
      }
    }
    return this.handler();
  };
  // DOM traversal and manipulation methods
  V.prototype.filter = (func)=>{
    Array.prototype.filter.call(this.nodes, func);
    return this.handler();
  };
  V.prototype.each = (func)=>{
    Array.prototype.forEach.call(this.nodes, func);
    return this.handler();
  };
  V.prototype.map = (func)=>{
    Array.prototype.map.call(this.nodes, func);
    return this.handler();
  };
  V.prototype.find = (_selector)=>{
    this.selector = this.query(this.node, _selector);
    return this.handler();
  };
  V.prototype.hide = ()=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].style.display = 'none';
    }
    return this.handler();
  };
  V.prototype.show = ()=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].style.display = 'block';
    }
    return this.handler();
  };
  V.prototype.remove = ()=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].parentNode.removeChild(this.nodes[i]);
    }
    return this.handler();
  };
  V.prototype.empty = ()=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].innerHTML = '';
    }
    return this.handler();
  };
  V.prototype.clone = ()=>{
    var clone = this.node.cloneNode(true);
    this.selector = clone;
    return this.handler();
  };
  V.prototype.wrap = ()=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      while (this.nodes[i].firstChild) {
        this.nodes[i].removeChild(this.nodes[i].firstChild);
      }
    }
    return this.handler();
  };
  V.prototype.parent = (el)=>{
    if (el) {
      this.selector = this.query(this.node.parentNode, el);
    } else {
      this.selector = this.node.parentNode;
    }
    return this.handler();
  };
  V.prototype.children = ()=>{
    var arr = [];
    var children = this.nodes[0].children;
    for (var i = children.length - 1; i >= 0; i--) {
      arr.push(children[i]);
    }
    this.selector = arr;
    return this.handler();
  };
  V.prototype.isEmpty = ()=>{
    return !this.node.hasChildNodes();
  };
  V.prototype.siblings = ()=>{
    this.nodes = this.node.parentNode.children;
    return this.filter((child)=>{
      return child !== this.node;
    });
  };
  V.prototype.next = ()=>{
    this.selector = this.node.nextElementSibling;
    return this.handler();
  };
  V.prototype.prev = ()=>{
    this.selector = this.node.previousElementSibling;
    return this.handler();
  };
  V.prototype.addClass = (_class)=>{
    var classArr = _class.split(' ');
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      for (var y = 0; y < classArr.length; y++) {
        this.nodes[i].classList.add(classArr[y]);
      }
    }
    return this.handler();
  };
  V.prototype.removeClass = (_class)=>{
    var classArr = _class.split(' ');
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      for (var y = 0; y < classArr.length; y++) {
        this.nodes[i].classList.remove(classArr[y]);
      }
    }
    return this.handler();
  };
  V.prototype.toggleClass = (_class)=>{
    var classArr = _class.split(' ');
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      for (var y = 0; y < classArr.length; y++) {
        this.nodes[i].classList.toggle(classArr[y]);
      }
    }
    return this.handler();
  };
  V.prototype.hasClass = (_class)=>{
    var bool = this.node.classList.contains(_class);
    return bool;
  };
  V.prototype.removeAttr = (attr)=>{   
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].removeAttribute(attr);
    }
    return this.handler();
  };
  // V(selector).attr() returns an object of camelized attribute keys. 
  // V(selector).attr({dataId: '0'}) -> <div data-id="0"></div>
  V.prototype.attr = (props)=>{  
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      if (props) {
        for (var y in props) {
          this.nodes[i].setAttribute(this.decamelize(y), props[y]);
        }
        return this.handler();
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
  // V(selector).css({backgroundColor: '#FFF'}) -> <div style="background-color:#FFF;"></div>
  V.prototype.css = (props)=>{
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
  V.prototype.rect = ()=>{
    return this.node.getBoundingClientRect();
  };
  V.prototype.offset = ()=>{ 
    let rect = this.rect();
    let offset = {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
    return offset;
  };
  V.prototype.offsetParent = ()=>{
    return this.node.offsetParent || this.node;
  };
  V.prototype.outerHeight = (withMargin)=>{
    let height = this.node.offsetHeight;
    if (withMargin) {
      let style = this.css();
      height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    }
    return height;
  };
  V.prototype.outerWidth = (withMargin)=>{
    let width = this.node.offsetWidth;
    if (withMargin) {
      let style = this.css();
      width += parseInt(style.marginTop) + parseInt(style.marginBottom);
    }
    return width;
  };
  V.prototype.html = (contents)=>{ 
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
  V.prototype.parseHTML = (string)=>{
    let tmp = document.implementation.createHTMLDocument();
    tmp.body.innerHTML = this.string ? this.string : string;
    return tmp.body.children;
  };
  V.prototype.json = (input)=>{
    let _input = this.nodes ? this.nodes : input;
    let output = JSON.stringify(_input);
    if (output && typeof _input !== 'string') {
      return JSON.stringify(_input);
    } else {
      error(`Parameter passed to the json method cannot be converted into valid JSON.`);
    }
  };
  V.prototype.parseJSON = (string)=>{
    string = this.string ? this.string : string;
    let output;
    try {
      output = JSON.parse(string);
    } catch (e) {
      error(`Parameter passed to the parseJSON method is not valid JSON.\n${e}`);
    }
    return output;
  };
  V.prototype.trim = (string)=>{
    string = this.string ? this.string : string;
    return string.trim();
  };
  V.prototype.type = (input)=>{
    input = this.nodes ? this.nodes : this.string ? this.string : input;
    return isElement(this.node) ? 'node' : this.typeOf(input);
  };
  V.prototype.replaceWith = (string)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      if (string && typeof string === 'string') {
        this.nodes[i].outerHTML = string;
        return this.handler();
      } else {
        error(`Parameter passed to the replaceWith method is not of the type 'string'.`);
      }
    }
  };
  V.prototype.text = (contents)=>{
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
  V.prototype.insertBefore = (el1, el2)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].insertBefore(el1, el2);
    }
    return this.handler();
  };
  V.prototype.prepend = (selectedElement)=>{ 
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].insertBefore(selectedElement, this.nodes[i].firstChild);
    }
    return this.handler();
  };
  V.prototype.append = (element)=>{ 
    let _element = isElement(element) ? element : this.query(document, element)[0];
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].appendChild(_element);
    }
    return this.handler();
  };
  V.prototype.after = (string)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].insertAdjacentHTML('afterend', string);
    }
    return this.handler();
  };
  V.prototype.before = (string)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].insertAdjacentHTML('beforebegin', string);
    }
    return this.handler();
  };
  V.prototype.contains = (text)=>{
    let textContent;
    if (this.string) {
      textContent = this.string;
    } else {
      textContent = this.node.textContent;
    }
    var bool = textContent.indexOf(text) > -1;
    return bool;
  };
  V.prototype.is = (el)=>{
    return this.node === this.query(document, el)[0];
  };
  // Used by attr method
  V.prototype.camelize = (string)=>{
    string = this.string ? this.string : string;
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '').replace(/[-_]+/g, '');
  };
  V.prototype.decamelize = (string)=>{
    string = this.string ? this.string : string;
    return string
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3')
      .replace(/^./, function(str){ return str.toLowerCase(); });
  };
  V.prototype = {
    get n(){
      return this.node;
    }
  };
};

export default V;