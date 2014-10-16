'use strict';

var fs = require('fs');

var noop = require('nop');
var rimrafPromise = require('./');
var test = require('tape');

test('rimrafPromise()', function(t) {
  t.plan(6);

  fs.writeFileSync('foo', '');

  rimrafPromise('foo')
    .then(function(res) {
      t.notOk(fs.existsSync('foo'), 'should remove a file.');
      t.strictEqual(res, undefined, 'should pass no value to the onFulfilled function.');
    });

  fs.mkdirSync('bar');

  rimrafPromise('bar')
    .then(function() {
      t.notOk(fs.existsSync('bar'), 'should remove a directory.');
    });

  rimrafPromise('baz')
    .then(function() {
      t.pass('should be fulfilled even if the file doesn\'t exist.');
    });

  rimrafPromise()
    .then(noop, function(err) {
      t.ok(err.message, 'should be rejected when it takes no arguments.');
    });

  rimrafPromise(['1'])
    .catch(function(err) {
      t.ok(err.message, 'should be rejected when it takes an invalid argument.');
    });
});
