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
    let _param = this.param ? this.param : param;
    return new v(_param);
  };
  var _nodes;
  if (typeof param === 'string') {
    _nodes = document.querySelectorAll(param);
  } else {
    _nodes = param;
  }
  this.nodes = Array.prototype.slice.call(_nodes);
      document.addEventListener('DOMContentLoaded', func);
    },
    load: function(func) {
      document.addEventListener('onload', func);
    },
    on: function(event, func) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].addEventListener(event, func);
      }
      return this;
    },
    off: function(event, func) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].removeEventListener(event, func);
      }
      return this;
    },
    trigger: function(event) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        if (this.nodes()[i].fireEvent) {
          (this.nodes()[i].fireEvent('on' + event));
        } else {
          var evObj = document.createEvent('Events');
          evObj.initEvent(event, true, false);
          this.nodes()[i].dispatchEvent(evObj);
        }
      }
    },
    click: function(func) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        if (func) {
          this.nodes()[i].addEventListener('click', func);
        } else {
          this.trigger('click');
        }
      }
      return this;
    },
    hide: function() {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].style.display = 'none';
      }
      return this;
    },
    show: function() {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].style.display = 'block';
      }
      return this;
    },
    remove: function() {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].parentNode.removeChild(this.nodes()[i]);
      }
      return this;
    },
    empty: function() {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].innerHTML = '';
      }
      return this;
    },
    clone: function() {
      var clone = this.node().cloneNode(true);
      selector = clone;
      return this;
    },
    wrap: function() {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        while (this.nodes()[i].firstChild) {
          this.nodes()[i].removeChild(this.nodes()[i].firstChild);
        }
      }
      return this;
    },
    parent: function() {
      selector = this.node().parentNode;
      return this;
    },
    children: function() {
      var arr = [];
      var children = this.node().children;
      for (var i = children.length - 1; i >= 0; i--) {
        arr.push(children[i]);
      }
      selector = arr;
      return this;
    },
    isEmpty: function() {
      return !this.node().hasChildNodes();
    },
    next: function() {
      selector = this.node().nextElementSibling;
      return this;
    },
    addClass: function(_class) {
      var classArr = _class.split(' ');
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        for (var y = 0; y < classArr.length; y++) {
          this.nodes()[i].classList.add(classArr[y]);
        }
      }
      return this;
    },
    removeClass: function(_class) {
      var classArr = _class.split(' ');
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        for (var y = 0; y < classArr.length; y++) {
          this.nodes()[i].classList.remove(classArr[y]);
        }
      }
      return this;
    },
    toggleClass: function(_class) {
      var classArr = _class.split(' ');
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        for (var y = 0; y < classArr.length; y++) {
          this.nodes()[i].classList.toggle(classArr[y]);
        }
      }
      return this;
    },
    hasClass: function(_class) {
      var bool = this.node().classList.contains(_class);
      return bool;
    },
    removeAttr: function(attr) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].removeAttribute(attr);
      }
      return this;
    },
    attr: function(props) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        if (props) {
          for (var y in props) {
            this.nodes()[i].setAttribute(this.decamelize(y), props[y]);
          }
          return this;
        } else {
          var obj = {};
          var name = null;
          var value = null;
          for (var z = this.nodes()[i].attributes.length - 1; z >= 0; z--) {
            name = this.camelize(this.nodes()[i].attributes[z].name);
            value = this.nodes()[i].attributes[z].value;
            obj[name] = value;
          }
          return obj;
        }
      }
    },
    css: function(props) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        for (var y in props) {
          this.nodes()[i].style[y] = props[y];
        }
      }
      return this;
    },
    html: function(contents) {
      var output = [];
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        if (!contents) {
          output.push(this.nodes()[i].innerHTML);
        } else {
          this.nodes()[i].innerHTML = contents;
        }
      }
      return output;
    },
    text: function(contents) {
      var output = [];
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        if (!contents) {
          output.push(this.nodes()[i].textContent);
        } else {
          this.nodes()[i].textContent = contents;
        }
      }
      return output;
    },
    insertBefore: function(el1, el2) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].insertBefore(el1, el2);
      }
      return this;
    },
    prepend: function(selectedElement) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].insertBefore(selectedElement, this.nodes()[i].firstChild);
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
    
    let offsetHeight = this.nodes[0].offsetHeight;
    return this.nodes[0].offsetHeight;
  };
      }
      return this;
    },
    append: function(element) {
      for (var i = this.nodes().length - 1; i >= 0; i--) {
        this.nodes()[i].appendChild(element);
      }
      return this;
    },
    contains: function(text) {
      var bool = this.node().textContent.indexOf(text) > -1;
      return bool;
    },
    camelize: function(string) {
      return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '').replace(/[-_]+/g, '');
    },
    decamelize: function(string) {
      return string
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3')
        .replace(/^./, function(str){ return str.toLowerCase(); });
    }
  };
}