var v = function(param) {
  if (!(this instanceof v)) {
    return new v(param);
  } 
  if (param instanceof v) {
    return param;
  }
  if (param && param.nodeName) {
    param = [param];
    if (!this.param) {
      this.param = param;
    }
  }
  var error = (msg)=>{
    console.error(`vQuery: ${msg}`);
  };
  this.handler = ()=>{
    // If the param is updated, start a new instance with the updated parameter.
    let _param = this.param ? this.param : param;
    return new v(_param);
  };
  // Turn the CSS selector into a node, or pass an existing node to this.nodes, which is used by all methods.
  var _nodes;
  if (typeof param === 'string') {
    _nodes = document.querySelectorAll(param);
  } else {
    _nodes = param;
  }
  this.nodes = Array.prototype.slice.call(_nodes);

  // v(selector).get(0) -> <div></div>
  this.get = (i)=>{
    return this.nodes[i];
  };
  // Event methods
  v.prototype.ready = (func)=>{
    if (func && typeof func !== 'undefined' &&typeof func === 'function') {
      document.addEventListener('DOMContentLoaded', func);
    } else {
      error('Parameter supplied to the ready method is not a function.');
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
  v.prototype.contains = (text)=>{
    var bool = this.nodes[0].textContent.indexOf(text) > -1;
    return bool;
  };
  // Used by attr method
  v.prototype.camelize = (string)=>{  
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '').replace(/[-_]+/g, '');
  };
  v.prototype.decamelize = (string)=>{
    return string
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3')
      .replace(/^./, function(str){ return str.toLowerCase(); });
  };
};

export default v;