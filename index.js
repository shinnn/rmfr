'use strict';

const assertValidGlobOpts = require('assert-valid-glob-opts');
const fs = require('graceful-fs');
const inspectWithKind = require('inspect-with-kind');
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
	silent: true
};
const RIMRAF_DOC_URL = 'https://github.com/isaacs/rimraf#options';

module.exports = function rmfr(filePath, options) {
	if (options) {
		if (typeof options !== 'object') {
			return Promise.reject(new TypeError(`Expected an option object passed to rimraf (${RIMRAF_DOC_URL}), but got ${
				inspectWithKind(options)
			}.`));
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
			errors.push(`\`${method}\` option must be a function, but got ${
				inspectWithKind(options[method])
			}.`);
		}
	}

	if (options.maxBusyTries !== undefined && typeof options.maxBusyTries !== 'number') {
		errors.push(`\`maxBusyTries\` option must be a number, but got ${
			inspectWithKind(options.maxBusyTries)
		}.`);
	}

	if (options.emfileWait !== undefined && typeof options.emfileWait !== 'number') {
		errors.push(`\`emfileWait\` option must be a number, but got ${
			inspectWithKind(options.emfileWait)
		}.`);
	}

	if (options.glob === true) {
		options.glob = defaultGlobOptions;
	} else if (typeof options.glob === 'object') {
		assertValidGlobOpts(options.glob);

		options.glob = Object.assign({
			nosort: true,
			silent: true
		}, options.glob, {
			// Remove this line when isaacs/rimraf#133 is merged
			absolute: options.glob.cwd !== undefined
		});
	} else if (options.glob !== false) {
		errors.push(`\`glob\` option must be an object passed to \`glob\` or a Boolean value, but got ${
			inspectWithKind(options.glob)
		}.`);
	}

	if (options.disableGlob !== undefined && typeof options.disableGlob !== 'boolean') {
		errors.push(`\`disableGlob\` option must be a boolean, but got ${
			inspectWithKind(options.disableGlob)
		}.`);
	}

	if (errors.length === 1) {
		return Promise.reject(new TypeError(`${errors[0]} ${RIMRAF_DOC_URL}`));
	}

	if (errors.length !== 0) {
		return Promise.reject(new TypeError(`There was ${errors.length} errors in rimraf options you provided:
${errors.map(error => `  * ${error}`).join('\n')}
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
