'use strict';

var glob = require('glob');
var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var gaze = require('gaze');
var futil = require('fosify');
var pkg = require('./package.json');
var minify = require('html-minifier').minify;

function rebundle(opts, cb) {
  cb = cb || futil.noop;

  var src = opts.src;
  var dest = opts.dest || './dist';
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

module.exports = function(plugin, opts, next) {
  futil.notifyUpdate(pkg);

  plugin.expose('bundle', function(cb) {
    cb = cb || function() {};
    rebundle(opts, function() {
      if (!opts.watch) {
        return;
      }
      gaze(opts.src + '/**/*.html', function(err, watcher) {
        watcher.on('all', () => rebundle(opts));
      });
    });
  });

  plugin.root.extensions.push('html');

  next();
};

module.exports.attributes = {
  pkg: require('./package.json'),
  compatibility: '1.x'
};
