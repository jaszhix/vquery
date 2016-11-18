var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var replace = require('frep');
var webpackStatsHelper = require('../helper/webpack-stats-helper');

var indexAppPath = path.join(__dirname, '../app/index.html');
var indexDistPath = path.join(__dirname, '../dist/index.html');
var patterns = webpackStatsHelper.getReplacePatterns(path.join(__dirname, '../webpack.stats.json'));

fs.readFile(indexAppPath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log('Process index.html');
  var result = replace.strWithArr(data, patterns);

  fs.writeFile(indexDistPath, result, 'utf8', function (err) {
    if (err) return console.log(err);
    console.log('Create ./dist/index.html');
  });
});
exec('gulp post-build', function(err, stdout, stderr) {
	console.log('Post-build...');
    console.log(stdout);
    console.log(stderr);
});