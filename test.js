'use strong';

const fs = require('fs');

const pathExists = require('path-exists');
const rimrafPromise = require('./');
const test = require('tape');

test('rimrafPromise()', t => {
  t.plan(7);

  fs.writeFileSync('foo', '');

  rimrafPromise('foo').then(res => {
    pathExists('foo').then(exists => t.notOk(exists, 'should remove a file.'));
    t.strictEqual(res, undefined, 'should pass no value to the onFulfilled function.');
  }).catch(t.fail);

  rimrafPromise('inde*.js', {disableGlob: true}).then(() => {
    pathExists('index.js').then(exists => t.ok(exists, 'should support rimraf options.'));
  }).catch(t.fail);

  rimrafPromise('/', null).then(t.fail, err => {
    t.ok(err, 'should be rejected when rimraf cannot remove the target.');
  }).catch(t.fail);

  rimrafPromise().then(t.fail, err => {
    t.ok(/missing path/.test(err), 'should be rejected when it takes no arguments.');
  }).catch(t.fail);

  rimrafPromise(['1'], undefined).then(t.fail, err => {
    t.ok(/should be a string/.test(err), 'should be rejected when the first argument is not a string.');
  }).catch(t.fail);

  rimrafPromise('foo', false).then(t.fail, err => {
    t.ok(/missing options/.test(err), 'should be rejected when it takes the non-object second argument.');
  }).catch(t.fail);
});
