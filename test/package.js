'use strict';

var expect = require('chai').expect;
var fhtml = require('../');

describe('fosify-js', function() {
  it('exports a function', function() {
    expect(fhtml).to.be.a('function');
  });

  it('returns the correct set of extensions', function() {
    expect(fhtml.extensions).to.be.instanceof(Array);
    expect(fhtml.extensions.length).to.equal(1);
    expect(fhtml.extensions[0]).to.equal('html');
  });
});
