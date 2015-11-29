'use strict';

var Foso = require('foso');
var html = require('../');

var foso = new Foso();
foso
  .register(html, {
    src: './src',
    dest: './dist',
    watch: true,
    minify: true
  })
  .then(() => foso.bundle())
  .then(() => console.log('bundled'));
