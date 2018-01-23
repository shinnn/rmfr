'use strict';

const {promisify} = require('util');

const {lstat, mkdir, writeFile} = require('graceful-fs');
const rmfr = require('.');
const test = require('tape');

const promisifiedLstat = promisify(lstat);
const promisifiedMkdir = promisify(mkdir);
const promisifiedWriteFile = promisify(writeFile);

test('rmfr()', async t => {
	await Promise.all([
		promisifiedWriteFile('tmp_file', ''),
		promisifiedMkdir('tmp_dir')
	]);

	await rmfr('tmp_file');

	try {
		await promisifiedLstat('tmp_file');
		t.fail('File not removed.');
	} catch ({code}) {
		t.equal(
			code,
			'ENOENT',
			'should remove a file.'
		);
	}

	await rmfr('tmp_d*', {});

	t.ok(
		(await promisifiedLstat('tmp_dir')).isDirectory(),
		'should disable `glob` option by default.'
	);

	await rmfr('../{tmp_d*,test.js}', {
		glob: {
			cwd: 'node_modules',
			ignore: __filename
		}
	});

	try {
		await promisifiedLstat('../{tmp_d*,package.json}');
		t.fail('Directory not removed.');
	} catch ({code}) {
		t.equal(
			code,
			'ENOENT',
			'should support glob.'
		);
	}

	t.ok(
		(await promisifiedLstat(__filename)).isFile(),
		'should support glob options.'
	);

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

	await rmfr('test.js', {
		glob: {
			cwd: 'this/directory/does/not/exist'
		}
	});

	t.ok(
		(await promisifiedLstat(__filename)).isFile(),
		'should consider `cwd` even if the path contains no special characters.'
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
			'Expected 1 or 2 arguments (<string>[, <Object>]), but got no arguments.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await rmfr('<', {o: 'O'}, '/');
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.equal(
			message,
			'Expected 1 or 2 arguments (<string>[, <Object>]), but got 3 arguments.',
			'should fail when it takes too many arguments.'
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
			/^Expected an option object passed to rimraf.*, but got 1 \(number\)\./.test(message),
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
			glob: 'baz'
		});
		t.fail('Unexpectedly succeeded.');
	} catch ({name}) {
		t.equal(
			name,
			'TypeError',
			'should fail when it takes invalid options.'
		);
	}

	try {
		await rmfr('foo', {disableGlob: true});
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.equal(
			message,
			'rmfr doesn\'t support `disableGlob` option, but a value true (boolean) was provided. ' +
			'rmfr disables glob feature by default. https://github.com/isaacs/rimraf#options',
			'should fail when `disableGlob` option is provided.'
		);
	}

	try {
		await rmfr('foo', {
			glob: {
				ignore: new WeakSet()
			}
		});
		t.fail('Unexpectedly succeeded.');
	} catch ({message}) {
		t.equal(
			message,
			'node-glob expected `ignore` option to be an array or string, but got WeakSet {}.',
			'should fail when it takes invalid glob options.'
		);
	}

	t.end();
});
