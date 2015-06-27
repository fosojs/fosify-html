'use strict';

var foso = require('foso');
var html = require('../');

foso
  .please({
    src: './src',
    dest: './build',
    watch: true,
    minify: true
  })
  .fosify(html)
  .now(function() {
    console.log('bundled');
  });
