'use strict';

const rimraf = require('rimraf');

module.exports = function rimrafPromise(filePath, options) {
  if (options === undefined || options === null) {
    options = {};
  }

  return new Promise(function wrapPromise(resolve, reject) {
    rimraf(filePath, options, function rimrafCallback(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
