'use strict';

var glob = require('glob');
var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var gaze = require('gaze');
var futil = require('fosify-util');
var minify = require('html-minifier').minify;

function rebundle(opts, cb) {
  cb = cb || futil.noop;

  var src = opts.src;
  var dest = opts.dest || './build';
  var createPath = futil.bundleNamer({
    src: src,
    extension: 'html'
  });

  glob(src + '{/*/**/bundle,/**/*.bundle}.html', { ignore: opts.ignore }, function(err, files) {
    async.eachSeries(files, function(filePath, cb) {
      var bundleName = createPath(filePath);
      var dest = path.join(opts.dest, bundleName);

      var str = fs.readFileSync(filePath, {
        encoding: 'utf8'
      });

      var html;
      if (opts.minify) {
        html = minify(str, {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        });
      } else {
        html = str;
      }

      futil.saveFile(dest, html);
      futil.log.bundled(bundleName);
      cb();
    }, cb);
  });
}

function bundle(opts, cb) {
  rebundle(opts, function() {
    if (opts.watch) {
      gaze(opts.src + '/**/*.html', function(err, watcher) {
        watcher.on('all', function() {
          rebundle(opts);
        });
      });
    }

    cb();
  });
}

module.exports = bundle;
module.exports.extensions = ['html'];
