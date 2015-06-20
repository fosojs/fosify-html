'use strict';

var fosify = require('fosify');
var html = require('../');

fosify({
  src: './src',
  dest: './build',
  host: 'example.com',
  secureHost: 'secure.example.com',
  watch: true,
  minify: true
})
.plugin(html)
.bundle(function() {
  console.log('bundled');
});
