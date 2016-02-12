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
      assignNodes(Array.prototype.slice.call(this.query(document, selector)));
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
    if (func && typeof func !== 'undefined' &&typeof func === 'function') {
      document.addEventListener('DOMContentLoaded', func);
    } else {
      error(`Parameter passed to the ready method is not of the type 'function'.`);
    }
  };
  v.prototype.load = (func)=>{
    document.addEventListener('onload', func);
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
      if (this.nodes[i].fireEvent) {
        (this.nodes[i].fireEvent('on' + event));
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(event, true, false);
        this.nodes[i].dispatchEvent(evObj);
      }
    }
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
  v.prototype.find = (_selector)=>{
    this.selector = this.node.querySelectorAll(_selector);
    return this.handler();
  };
  v.prototype.hide = ()=>{
  V.prototype.find = (_selector)=>{
    this.selector = this.query(this.node, _selector);
    return this.handler();
  };
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
    var clone = this.nodes[0].cloneNode(true);
    this.param = clone;
    return this.handler();
  };
  v.prototype.wrap = ()=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      while (this.nodes[i].firstChild) {
        this.nodes[i].removeChild(this.nodes[i].firstChild);
      }
    }
    return this.handler();
  };
  v.prototype.parent = ()=>{
    this.param = this.nodes[0].parentNode;
    return this.handler();
  };
  v.prototype.children = ()=>{
    var arr = [];
    var children = this.nodes[0].children;
    for (var i = children.length - 1; i >= 0; i--) {
      arr.push(children[i]);
    }
    param = arr;
    return this.handler();
  };
  v.prototype.isEmpty = ()=>{
    return !this.nodes[0].hasChildNodes();
  };
  v.prototype.next = ()=>{
    this.param = this.nodes[0].nextElementSibling;
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
    var bool = this.nodes[0].classList.contains(_class);
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
  v.prototype.attr = (props)=>{  
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
  // v(selector).css({backgroundColor: '#FFF'}) -> <div style="background-color:#FFF;"></div>
  v.prototype.css = (props)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      for (var y in props) {
        this.nodes[i].style[y] = props[y];
      }
    }
    return this.handler();
  };
  v.prototype.rect = ()=>{
    return this.nodes[0].getBoundingClientRect();
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
    return this.nodes[0].offsetParent || this.nodes[0];
  };
  v.prototype.outerHeight = ()=>{
    return this.nodes[0].offsetHeight;
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
    return output;
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
    return output;
  };
  v.prototype.insertBefore = (el1, el2)=>{
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].insertBefore(el1, el2);
    }
    return this.handler();
  };
  v.prototype.prepend = (selectedElement)=>{ 
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].insertBefore(selectedElement, this.nodes[i].firstChild);
    }
    return this.handler();
  };
  v.prototype.append = (element)=>{ 
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      this.nodes[i].appendChild(element);
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
};

export default v;