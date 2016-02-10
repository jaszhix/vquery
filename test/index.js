import {expect} from 'chai';

import v from '../src/index';

describe('vquery', function () {
  // setup and teardown methods for vquery tests
  before(function () {
    this.wrap = document.createElement('div');
    document.body.appendChild(this.wrap);
  });
  beforeEach(function () {
    this.div = document.createElement('div');
    this.divClass = 'test-wrap';
    this.divSelector = '.' + this.divClass;

    this.div.className = this.divClass;
    this.wrap.appendChild(this.div);
  });
  after(function () {
    document.body.innerHTML = '';
  });
  afterEach(function () {
    this.wrap.removeChild(this.div);
  });

  describe('basic methods', function () {
    it('returns a node', function () {
      expect(v(this.divSelector).nodes[0]).to.equal(this.div);
    });
    it('hides a node', function () {
      expect(v(this.divSelector).hide().nodes[0].style.display === 'none').to.equal(this.div.style.display === 'none');
    });
    it('shows a node', function () {
      this.div.style.display === 'none';
      expect(v(this.divSelector).show().nodes[0].style.display === 'block').to.equal(this.div.style.display === 'block');
    });
    it('removes a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v('newDiv').remove().nodes[0]).to.equal(undefined);
    });
    it('empties a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v(this.divSelector).empty().nodes[0].innerHTML === '').to.equal(this.div.innerHTML === '');
    });
    /*it('clones a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.clone = v(this.newDiv).clone().nodes[0];
      //this.newDiv.parentNode.insertBefore(this.clone, this.newDiv);
      expect(this.newDiv).to.equal(this.clone);
    });*/
    /*it('selects a parent node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v('.new-div').parent().nodes).to.equal(this.div);
    });*/
    it('selects children nodes', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v(this.divSelector).children().nodes[0]).to.equal(this.div.children[0]);
    });
    it('determines if node is empty', function () {
      expect(v(this.divSelector).isEmpty()).to.equal(true);
    });
    it('selects sibling node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      this.div.appendChild(this.newDiv2);
      expect(v(this.newDiv).next().nodes[0]).to.equal(this.newDiv2);
    });
    it('adds classes', function () {
      expect(v(this.div).addClass('whoop dee doo').nodes[0].classList).to.equal(this.div.classList);
    });
    it('removes classes', function () {
      v(this.div).addClass('whoop dee doo');
      expect(v(this.div).removeClass('whoop dee doo').nodes[0].classList).to.equal(this.div.classList);
    });
    it('toggles classes', function () {
      v(this.divSelector).toggleClass('whoop dee doo');
      expect(v(this.divSelector).toggleClass('whoop dee doo').nodes[0].classList).to.equal(this.div.classList);
    });
    it('determines if node has a class', function () {
      expect(v(this.divSelector).hasClass('test-wrap')).to.equal(true);
    });
    it('removes an attribute from a node', function () {
      this.div.setAttribute('id', 'main');
      expect(v(this.divSelector).removeAttr('id').nodes[0].attributes).to.equal(this.div.attributes);
    });
    it('sets an object of attributes to a node', function () {
      expect(v(this.divSelector).attr({id: 'main', dataReactid: '.0.2.1.0.1.0.$2661.0'}).nodes[0].attributes).to.equal(this.div.attributes);
    });
    it('returns an object of attributes from a node', function () {
      this.div.setAttribute('data-reactid', '.0.2.1.0.1.0.$2661.0');
      expect(v(this.divSelector).attr().dataReactid).to.equal('.0.2.1.0.1.0.$2661.0');
    });
    it('manipulates css', function () {
      expect(v(this.divSelector).css({position: 'absolute', color: '#FFF'}).nodes[0].style).to.equal(this.div.style);
    });
    it('sets html', function () {
      v(this.divSelector).html('<p>Text!</p>');
      expect(this.div.innerHTML).to.equal('<p>Text!</p>');
    });
    it('returns html', function () {
      v(this.divSelector).html('<p>Text!</p>');
      expect(v(this.divSelector).html()[0]).to.equal('<p>Text!</p>');
    });
    it('sets text content', function () {
      v(this.divSelector).text('something');
      expect(this.div.textContent).to.equal('something');
    });
    it('inserts a node before another node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      v(this.divSelector).insertBefore(this.newDiv2, this.newDiv);
      expect(this.div.children[0]).to.equal(this.newDiv2);
    });
    it('prepends a node to a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      v(this.divSelector).prepend(this.newDiv2);
      expect(this.div.children[0]).to.equal(this.newDiv2);
    });
    it('appends a node to a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      v(this.divSelector).append(this.newDiv2);
      expect(this.div.children[1]).to.equal(this.newDiv2);
    });
    it('determines if a node\'s text content contains something', function () {
      this.div.textContent = 'something new and different';
      expect(v(this.divSelector).contains('and')).to.equal(true);
    });
    it('returns text content', function () {
      this.div.innerHTML = 'something new';
      expect(v(this.divSelector).text()[0]).to.equal('something new');
    });
  });
});
