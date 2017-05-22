'use strict';

const inspect = require('util').inspect;

const fs = require('graceful-fs');
const rimraf = require('rimraf');

const fsMethods = [
  'unlink',
  'chmod',
  'stat',
  'lstat',
  'rmdir',
  'readdir'
];
const defaultGlobOptions = {
  nosort: true,
  silent: true,
  // Remove this line when isaacs/rimraf#133 is merged
  absolute: true
};
const RIMRAF_DOC_URL = 'https://github.com/isaacs/rimraf#options';

module.exports = function rmfr(filePath, options) {
  if (options) {
    if (typeof options !== 'object') {
      return Promise.reject(new TypeError(
        inspect(options) +
        ` is not an object. Expected an option object passed to rimraf ${RIMRAF_DOC_URL}.`
      ));
    }
  } else {
    options = {};
  }

  const errors = [];

  options = Object.assign({
    glob: false,
    unlink: fs.unlink,
    chmod: fs.chmod,
    rmdir: fs.rmdir,
    readdir: fs.readdir
  }, options);

  for (const method of fsMethods) {
    if (options[method] !== undefined && typeof options[method] !== 'function') {
      errors.push(`\`${method}\` option must be a function, but got ${inspect(options[method])} (${typeof options[method]}).`);
    }
  }

  if (options.maxBusyTries !== undefined && typeof options.maxBusyTries !== 'number') {
    errors.push(`\`maxBusyTries\` option must be a number, but got ${inspect(options.maxBusyTries)} (${typeof options.maxBusyTries}).`);
  }

  if (options.emfileWait !== undefined && typeof options.emfileWait !== 'number') {
    errors.push(`\`emfileWait\` option must be a number, but got ${inspect(options.emfileWait)} (${typeof options.emfileWait}).`);
  }

  if (options.glob === true) {
    options.glob = defaultGlobOptions;
  } else if (options.glob !== false && typeof options.glob !== 'object') {
    errors.push(`\`glob\` option must be an object passed to \`glob\` or a Boolean value, but got ${inspect(options.glob)} (${typeof options.glob}).`);
  }

  if (options.disableGlob !== undefined && typeof options.disableGlob !== 'boolean') {
    errors.push(`\`disableGlob\` option must be a boolean, but got ${inspect(options.disableGlob)} (${typeof options.disableGlob}).`);
  }

  if (errors.length === 1) {
    return Promise.reject(new TypeError(`${errors[0]} ${RIMRAF_DOC_URL}`));
  }

  if (errors.length !== 0) {
    return Promise.reject(new TypeError(`There was ${errors.length} errors in rimraf options you provided:
${errors.map(error => '  * ' + error).join('\n')}
Read ${RIMRAF_DOC_URL} for the details.`));
  }

  return new Promise((resolve, reject) => {
    rimraf(filePath, options, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
