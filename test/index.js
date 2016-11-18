import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import v from '../src/index';
import _ from 'lodash';
import $ from 'jquery';

chai.use(chaiAsPromised);

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
    document.body.removeChild(this.wrap);
  });
  afterEach(function () {
    this.wrap.removeChild(this.div);
  });

  describe('basic methods', function () {
    it('[node] returns a node', function () {
      expect(v(this.divSelector).node).to.equal(this.div);
    });
    it('[nodes] returns an array of nodes', function () {
      expect(v(this.div).nodes.length).to.equal(Array.prototype.slice.call(document.querySelectorAll('.test-wrap')).length);
    });
    it('[hide] hides a node', function () {
      expect(v(this.divSelector).hide().nodes[0].style.display === 'none').to.equal(this.div.style.display === 'none');
    });
    it('[show] shows a node', function () {
      this.div.style.display === 'none';
      expect(v(this.divSelector).show().nodes[0].style.display === 'block').to.equal(this.div.style.display === 'block');
    });
    it('[remove] removes a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v('newDiv').remove().nodes[0]).to.equal(undefined);
    });
    it('[empty] empties a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v(this.divSelector).empty().nodes[0].innerHTML === '').to.equal(this.div.innerHTML === '');
    });
    it('[wrap] wraps a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      v(this.newDiv).wrap('<span id="2" />');
      expect(this.div.innerHTML).to.equal('<span id="2"><div class="new-div"></div></span>');
    });
    // Clone method error - "after all" hook
    it('[clone] clones a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.clone = v('.new-div').clone().node;
      this.newDiv.parentNode.insertBefore(this.clone, this.newDiv);
      expect(this.div.children.length).to.equal(2);
    });
    it('[parent] selects a parent node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v('.new-div').parent().node).to.equal(this.div);
    });
    it('[children] selects children nodes', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v(this.divSelector).children().nodes[0]).to.equal(this.div.children[0]);
    });
    it('[allChildren] recursively selects every child nodes', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDivChild = document.createElement('div');
      this.newDivChild.className = 'new-div-c';
      this.newDiv.appendChild(this.newDivChild);
      this.newDivChildChild = document.createElement('div');
      this.newDivChildChild.className = 'new-div-c-c';
      this.newDivChild.appendChild(this.newDivChildChild);
      this.newDivChildChildChild = document.createElement('div');
      this.newDivChildChildChild.className = 'new-div-c-c-c';
      this.newDivChildChild.appendChild(this.newDivChildChildChild);
      expect(v(this.div).allChildren().length).to.equal(5);
      expect(v(this.div).allChildren('.new-div-c-c-c').n).to.equal(this.newDivChildChildChild);
    });
    it('[isEmpty] determines if node is empty', function () {
      expect(v(this.divSelector).isEmpty()).to.equal(true);
    });
    it('[inViewport] determines if node is in the viewport', function () {
      expect(v(this.divSelector).inViewport()).to.equal(true);
      v(this.divSelector).css({top: '-99999px', left: '6000px', position: 'absolute'});
      expect(v(this.divSelector).inViewport()).to.equal(false);
    });
    it('[siblings] selects all siblings', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      this.div.appendChild(this.newDiv2);
      expect(v(this.newDiv).siblings().length).to.equal(this.newDiv.parentNode.children.length - 1);
    });
    it('[next] selects the next sibling node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      this.div.appendChild(this.newDiv2);
      expect(v(this.newDiv).next().nodes[0]).to.equal(this.newDiv2);
    });
    it('[prev] selects the previous sibling node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      this.div.appendChild(this.newDiv2);
      this.newDiv3 = document.createElement('div');
      this.newDiv3.className = 'new-div-3';
      this.div.appendChild(this.newDiv3);
      expect(v(this.newDiv2).prev().nodes[0]).to.equal(this.newDiv);
    });
    it('[addClass] adds classes', function () {
      expect(v(this.div).addClass('whoop dee doo').nodes[0].classList).to.equal(this.div.classList);
    });
    it('[removeClass] removes classes', function () {
      v(this.div).addClass('whoop dee doo');
      expect(v(this.div).removeClass('whoop dee doo').nodes[0].classList).to.equal(this.div.classList);
    });
    it('[toggleClass] toggles classes', function () {
      v(this.divSelector).toggleClass('whoop dee doo');
      expect(v(this.divSelector).toggleClass('whoop dee doo').nodes[0].classList).to.equal(this.div.classList);
    });
    it('[hasClass] determines if node has a class', function () {
      expect(v(this.divSelector).hasClass('test-wrap')).to.equal(true);
    });
    it('[removeAttr] removes an attribute from a node', function () {
      this.div.setAttribute('id', 'main');
      expect(v(this.divSelector).removeAttr('id').nodes[0].attributes).to.equal(this.div.attributes);
    });
    it('[attr] sets an object of attributes to a node', function () {
      expect(v(this.divSelector).attr({id: 'main', dataReactid: '.0.2.1.0.1.0.$2661.0'}).nodes[0].attributes).to.equal(this.div.attributes);
    });
    it('[attr] returns an object of attributes from a node', function () {
      this.div.setAttribute('data-reactid', '.0.2.1.0.1.0.$2661.0');
      expect(v(this.divSelector).attr().dataReactid).to.equal('.0.2.1.0.1.0.$2661.0');
    });
    it('[css] manipulates css', function () {
      expect(v(this.divSelector).css({position: 'absolute', color: '#FFF'}).nodes[0].style).to.equal(this.div.style);
    });
    it('[val] sets the value of an input element and retrieves it', function () {
      v(this.divSelector).html('<input type="text"></input>');
      v(this.divSelector).val('Value set!');
      expect(this.div.value).to.equal('Value set!');
      expect(v(this.divSelector).val()).to.equal('Value set!');
    });
    it('[html] sets html', function () {
      v(this.divSelector).html('<p>Text!</p>');
      expect(this.div.innerHTML).to.equal('<p>Text!</p>');
    });
    it('[html] returns html', function () {
      v(this.divSelector).html('<p>Text!</p>');
      expect(v(this.divSelector).html()[0]).to.equal(this.div.outerHTML);
    });
    it('[replaceWith] replaces an element\'s HTML', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      v('.new-div').replaceWith('<div id="replacement"></div>');
      expect(v(this.div).children().nodes[0].outerHTML).to.equal('<div id="replacement"></div>');
    });
    it('[text] sets text content', function () {
      v(this.divSelector).text('something');
      expect(this.div.textContent).to.equal('something');
    });
    it('[text] returns text content', function () {
      this.div.innerHTML = 'something new';
      expect(v(this.divSelector).text()[0]).to.equal('something new');
    });
    it('[insertBefore] inserts a node before another node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      v(this.divSelector).insertBefore(this.newDiv2, this.newDiv);
      expect(this.div.children[0]).to.equal(this.newDiv2);
    });
    it('[prepend] prepends a node to a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      v(this.divSelector).prepend(this.newDiv2);
      expect(this.div.children[0]).to.equal(this.newDiv2);
    });
    it('[append] appends a node to a node', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div-2';
      v(this.divSelector).append(this.newDiv2);
      expect(this.div.children[1]).to.equal(this.newDiv2);
    });
    it('[contains] determines if a node\'s text content contains something', function () {
      this.div.textContent = 'something new and different';
      expect(v(this.divSelector).contains('and')).to.equal(true);
    });
    it('[click] [trigger] [css] attaches a click event and triggers it', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      v('.new-div').click(function(e){
        v('.new-div').css({backgroundColor: 'rgb(238, 238, 238)'});
      });
      v('.new-div').trigger('click');
      expect(this.newDiv.style.backgroundColor).to.equal('rgb(238, 238, 238)');
    });
    it('[filter] filters an array of elements', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div';
      this.div.appendChild(this.newDiv2);
      this.array = [];
      v('.new-div').filter(function(el, i, a){
        this.array.push(el);
      }.bind(this));
      expect(this.array.length).to.equal(v('.new-div').length);
    });
    it('[each] iterates an array of elements', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div';
      this.div.appendChild(this.newDiv2);
      this.array = [];
      v('.new-div').each(function(el, i){
        this.array.push(el);
      }.bind(this));
      expect(this.array.length).to.equal(v('.new-div').length);
    });
    it('[map] maps an array of elements and gets the first element of an array', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv2 = document.createElement('div');
      this.newDiv2.className = 'new-div';
      this.div.appendChild(this.newDiv2);
      v('.new-div').map(function(el, i){
        if (i === 0) {
          v(el).css({backgroundColor: 'rgb(238, 238, 238)'});
        }
      }.bind(this));
      expect(v('.new-div').get(0).css().backgroundColor).to.equal('rgb(238, 238, 238)');
    });
    it('[find] finds a child element', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDivChild = document.createElement('div');
      this.newDivChild.className = 'new-div-child';
      this.newDiv.appendChild(this.newDivChild);
      expect(v('.new-div').find('.new-div-child').node).to.equal(this.newDivChild);
    });
    it('[end] returns the original selector at the end of the method chain', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.p = document.createElement('p');
      this.p.className = 'child-p';
      this.newDiv.appendChild(this.p);
      expect(v(this.newDiv).find('p').get(0).css({color: '#FFF'}).attr({name: 'test'}).end().html()[0]).to.equal(this.div.innerHTML);
    });
    it('[position] gets the position of an element', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v('.new-div').position().top).to.equal(this.newDiv.offsetTop);
    });
    it('[rect] gets the position of an element relative to the viewport', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v('.new-div').rect().top).to.equal(this.newDiv.getBoundingClientRect().top);
    });
    it('[offset] gets offset of an element', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v('.new-div').offset().top).to.equal(this.newDiv.getBoundingClientRect().top + document.body.scrollTop);
    });
    it('[offsetParent] gets offset of an element parent', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v('.new-div').offsetParent()).to.equal(this.newDiv.offsetParent || this.newDiv);
    });
    it('[height] gets the outer height of an element with margin', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.style = getComputedStyle(this.newDiv);
      expect(v('.new-div').height(true)).to.equal(this.newDiv.offsetHeight += parseInt(this.style.marginTop) + parseInt(this.style.marginBottom));
    });
    it('[width] gets the outer width of an element with margin', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.style = getComputedStyle(this.newDiv);
      expect(v('.new-div').width(true)).to.equal(this.newDiv.offsetWidth += parseInt(this.style.marginTop) + parseInt(this.style.marginBottom));
    });
    it('[parseHTML] parses HTML', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      this.newDiv.innerHTML = '<button>Click me!</button>';
      expect(v('<div><button>Click me!</button></div').parseHTML()[0].innerHTML).to.equal(this.newDiv.innerHTML);
    });
    it('[after] inserts an HTML string after an element', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      v(this.newDiv).after('<button>Click me!</button>');
      expect(this.div.innerHTML).to.equal('<div class="new-div"></div><button>Click me!</button>');
    });
    it('[is] compares two elements', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      expect(v(this.newDiv).is('.new-div')).to.equal(true);
      expect(v(this.newDiv).is(this.div)).to.equal(false);
    });
    it('[before] inserts an HTML string before an element', function () {
      this.newDiv = document.createElement('div');
      this.newDiv.className = 'new-div';
      this.div.appendChild(this.newDiv);
      v(this.newDiv).before('<button>Click me!</button>');
      expect(this.div.innerHTML).to.equal('<button>Click me!</button><div class="new-div"></div>');
    });
    it('[json] stringifies JSON', function () {
      expect(v([{one: true}, {two: false}]).json()).to.equal('[{"one":true},{"two":false}]');
    });
    it('[parseJSON] parses JSON', function () {
      expect(v('[{"one":true},{"two":false}]').parseJSON()[1].two).to.equal(false);
    });
    it('[type] returns the type of a parameter', function () {
      expect(v(this.div).type()).to.equal('node');
      expect(v({}).type()).to.equal('object');
      expect(v([]).type()).to.equal('array');
      expect(v(true).type()).to.equal('boolean');
      expect(v(function(){}).type()).to.equal('function');
      expect(v(1).type()).to.equal('number');
    });
    it('[camelize] camelizes a string', function () {
      expect(v('data-Id').camelize()).to.equal('dataId');
    });
    it('[decamelize] decamelizes a string', function () {
      expect(v('dataId').decamelize()).to.equal('data-Id');
    });
    it('[mixin] passes vquery\'s context to lodash', function () {
      expect(v('div').mixin({_:_}).head().innerText).to.equal(this.div.innerText);
    });
    it('[mixin] passes vquery\'s context to jquery', function () {
      v(this.div).html('<h1></h1>');
      expect(v('h1').mixin({$:$}).eq(0)[0]).to.equal(v(this.div).find('h1').n);
    });
    it('[move] move an item in an array to and from the specified indexes', function () {
      var x = v([1,2,3]).move(2,0).ns;
      expect(x[0]).to.equal(3);
    });
    it('[GET ajax with no options] sends an AJAX request to http://jsonplaceholder.typicode.com/', function (done) {
      this.timeout(15000);
      expect(v().ajax('get', 'http://jsonplaceholder.typicode.com/posts')).to.eventually.have.length.of.at.least(100).and.notify(done);
    });
    it('[GET ajax with options.chain] sends an AJAX request to http://jsonplaceholder.typicode.com/', function (done) {
      this.timeout(15000);
      expect(v().ajax('get', 'http://jsonplaceholder.typicode.com/posts', {chain: true}).then((data)=>{
        if (typeof data !== 'undefined') {
          return data.type();
        }
      })).to.eventually.equal('array').and.notify(done);
    });
    it('[POST ajax]', function (done) {
      this.timeout(15000);
      var _data = {
        userId: 1,
        title: 'Test!!!',
        body: 'This is a vquery test.'
      };
      expect(v().ajax('post', 'http://jsonplaceholder.typicode.com/posts', {data: _data}).then((data)=>{
        if (typeof data !== 'undefined') {
          return data.body;
        }
      })).to.eventually.equal(_data.body).and.notify(done);
    });
    it('[noConflict] restores the original v reference and returns vquery', function () {
      var x = v().noConflict();
      expect(x().hasOwnProperty('selectorHistory')).to.equal(true);
    });
  });
});