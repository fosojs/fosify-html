'use strict';

var expect = require('chai').expect;
var fhtml = require('../');

describe('fosify-js', function() {
  it('exports a function', function() {
    expect(fhtml).to.be.a('function');
  });
});
