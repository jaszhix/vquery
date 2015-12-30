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
    document.body.removeChild(this.wrap);
  })
  afterEach(function () {
    this.wrap.removeChild(this.div);
  });

  describe('basic methods', function () {
    it('sets text content', function () {
      v(this.divSelector).text('something');
      expect(this.div.textContent).to.equal('something');
    });
    it('returns text content', function () {
      this.div.innerHTML = 'something new';
      expect(v(this.divSelector).text()[0]).to.equal('something new');
    });
  });
});
