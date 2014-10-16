/*!
 * rimraf-promise | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/rimraf-promise
*/

'use strict';

var ES6Promise = global.Promise || require('es6-promise').Promise;
var rimraf = require('rimraf');

module.exports = function rimrafPromise(filePath) {
  return new ES6Promise(function(resolve, reject) {
    rimraf(filePath, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
