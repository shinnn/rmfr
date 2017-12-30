'use strict';

const {promisify} = require('util');

const {lstat, writeFile} = require('graceful-fs');
const rmfr = require('.');
const test = require('tape');

const promisifiedLstat = promisify(lstat);
const promisifiedWriteFile = promisify(writeFile);

test('rmfr()', async t => {
	await promisifiedWriteFile('tmp_file_for_test', '');
	await rmfr('tmp_file_for_test');

	try {
		await promisifiedLstat('tmp_file_for_test');
		t.fail('File not removed.');
	} catch ({code}) {
		t.equal(
			code,
			'ENOENT',
			'should remove a file.'
		);
	}

	await rmfr('inde*.js', {});

	t.ok(
		await promisifiedLstat('index.js'),
		'should disable `glob` option by default.'
	);

	const error = new Error('_');

	try {
		await rmfr('.gitignore', {unlink: (path, cb) => cb(error)});
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(
			err,
			error,
			'should fail when an error occurs while calling rimraf.'
		);
	}

	try {
		await rmfr();
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.equal(
			message,
			'rimraf: missing path',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await rmfr(['1'], {glob: true});
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.equal(
			message,
			'rimraf: path should be a string',
			'should fail when the first argument is not a string.'
		);
	}

	try {
		await rmfr('foo', 1);
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.ok(
			message.includes('1 is not an object'),
			'should fail when the second argument is not an object.'
		);
	}

	try {
		await rmfr('foo', {chmod: new Set(['a'])});
		t.fail('Unexpectedly succeeded.');
	} catch ({name}) {
		t.equal(
			name,
			'TypeError',
			'should fail when it takes an invalid option.'
		);
	}

	try {
		await rmfr('foo', {
			maxBusyTries: 'foo',
			emfileWait: 'bar',
			glob: 'baz',
			disableGlob: 'qux'
		});
		t.fail('Unexpectedly succeeded.');
	} catch ({name}) {
		t.equal(
			name,
			'TypeError',
			'should fail when it takes invalid options.'
		);
	}

	t.end();
});
