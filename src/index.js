/*
vQuery - A vanilla JS wrapper for jQuery-like syntax
Version 0.1
*/
export default function (selector) {
  var methods = {
    nodes: document.querySelectorAll(selector),
    node: document.querySelector(selector),
    ready: function(func) {
      document.addEventListener('DOMContentLoaded', func);
    },
    load: function(func) {
      window.attachEvent( 'onload', func );
    },
    hide: function() {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].style.display = 'none';
      }
      return this;
    },
    show: function() {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].style.display = 'block';
      }
      return this;
    },
    remove: function() {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].parentNode.removeChild(this.nodes[i]);
      }
      return this;
    },
    empty: function() {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].innerHTML = '';  
      }
      return this; 
    },
    /*clone: function() {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].cloneNode(true);   
      }
      return this;
    },*/
    wrap: function (){
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        while (this.nodes[i].firstChild) {
          this.nodes[i].removeChild(this.nodes[i].firstChild);
        }
      }
      return this;
    },
    parent: function() {
      this.node.parentNode;
      return this;
    },
    isEmpty: function() {
      if (!this.node.hasChildNodes()) {
        return true;
      } else {
        return false;
      }     
    },
    next: function() {
      this.node.nextElementSibling;
      return this;
    },
    addClass: function(_class) {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].classList.add(_class);
      }
      return this;
    },
    removeClass: function(_class) {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].classList.remove(_class);
      }
      return this;
    },
    toggleClass: function(_class) {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].classList.toggle(_class);
      }
      return this;
    },
    hasClass: function(_class) {
      var bool = this.node.classList.contains(_class);
      return bool;
    },
    attr: function(key, value) {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].setAttribute(key, value);
      }
      return this;
    },
    css: function(props) {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        for (var y in props) {
          this.nodes[i].style[y] = props[y];
        }
      }
      return this;
    },
    click: function(func) {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].addEventListener('click', func);
      }
      return this;
    },
    html: function(contents) {
      var output = [];
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (!contents) {
          output.push(this.nodes[i].innerHTML);
        } else {
          this.nodes[i].innerHTML = contents;
        }
      }
      return output && this;
    },
    text: function(contents) {
      var output = [];
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (!contents) {
          output.push(this.nodes[i].textContent);
        } else {
          this.nodes[i].textContent = contents;
        }
      }
      return output && this;
    },
    prepend: function(selectedElement) {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].insertBefore(selectedElement, this.nodes[i].firstChild);
      }
      return this;
    },
    append: function(element) {
      for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].appendChild(element);
      }
      return this;
    },
    contains: function(text) {
      var bool = this.node.textContent.indexOf(text) > -1;
      return bool;
    }
  };
  return methods;
}
