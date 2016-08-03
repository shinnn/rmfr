'use strong';

const pathExists = require('path-exists');
const rmfr = require('.');
const test = require('tape');
const writeFileAtomically = require('write-file-atomically');

test('rmfr()', t => {
  t.plan(9);

  writeFileAtomically('tmp_file_for_test', '', () => {
    rmfr('tmp_file_for_test').then(res => {
      pathExists('tmp_file_for_test').then(exists => t.notOk(exists, 'should remove a file.'));
      t.strictEqual(res, undefined, 'should pass no value to the onFulfilled function.');
    });
  }).catch(t.fail);

  rmfr('inde*.js', {}).then(() => {
    pathExists('index.js').then(exists => t.ok(exists, 'should disable `glob` option by default.'));
  }).catch(t.fail);

  rmfr('.gitignore', {unlink: (path, cb) => cb(new Error('Ouch'))}).then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Ouch',
      'should fail when an error occurs while calling rimraf.'
    );
  }).catch(t.fail);

  rmfr().then(t.fail, err => {
    t.strictEqual(
      err.message,
      'rimraf: missing path',
      'should fail when it takes no arguments.'
    );
  }).catch(t.fail);

  rmfr(['1'], {glob: true}).then(t.fail, err => {
    t.strictEqual(
      err.message,
      'rimraf: path should be a string',
      'should fail when the first argument is not a string.'
    );
  }).catch(t.fail);

  rmfr('foo', 1).then(t.fail, err => {
    t.ok(
      err.message.includes('1 is not an object'),
      'should fail when the second argument is not an object.'
    );
  }).catch(t.fail);

  rmfr('foo', {chmod: new Set(['a'])}).then(t.fail, err => {
    t.strictEqual(
      err.name,
      'TypeError',
      'should fail when it takes an invalid option.'
    );
  }).catch(t.fail);

  rmfr('foo', {
    maxBusyTries: 'foo',
    emfileWait: 'bar',
    glob: 'baz',
    disableGlob: 'qux'
  }).then(t.fail, err => {
    t.strictEqual(
      err.name,
      'TypeError',
      'should fail when it takes invalid options.'
    );
  }).catch(t.fail);
});
