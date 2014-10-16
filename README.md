# rimraf-promise

[![Build Status](https://travis-ci.org/shinnn/rimraf-promise.svg?branch=master)](https://travis-ci.org/shinnn/rimraf-promise)
[![Build status](https://ci.appveyor.com/api/projects/status/sa0vd3nhfiupeu7h?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/rimraf-promise)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/rimraf-promise.svg)](https://coveralls.io/r/shinnn/rimraf-promise)
[![Dependency Status](https://david-dm.org/shinnn/rimraf-promise.svg)](https://david-dm.org/shinnn/rimraf-promise)
[![devDependency Status](https://david-dm.org/shinnn/rimraf-promise/dev-status.svg)](https://david-dm.org/shinnn/rimraf-promise#info=devDependencies)

[Promise][promise] version of [rimraf][rimraf]:

> `rm -rf` for node.

```javascript
var rimrafPromise = require('rimraf-promise');

rimrafPromise('path/should/be/removed')
  .then(function() {
    console.log('File has been removed successfully.');
  })
  .catch(function(err) {
    throw err;
  });
```

## Installation

[![NPM version](https://badge.fury.io/js/rimraf-promise.svg)](https://www.npmjs.org/package/rimraf-promise)

[Use npm](https://www.npmjs.org/doc/cli/npm-install.html).

```
npm install rimraf-promise
```

## API

```javascript
var rimrafPromise = require('rimraf-promise');
```

### rimrafPromise(*path*)

*path*: `String` (a file/directory path)  
Return: `Object` ([Promise][promise])

When it finish removing the target, it will be [*fulfilled*](http://promisesaplus.com/#point-26) with no arguments.

When it fails to remove the target, it will be [*rejected*](http://promisesaplus.com/#point-30) with an error as its first argument. [Here](https://github.com/isaacs/rimraf#api) is the details about how [rimraf][rimraf] handles its error.

```javascript
var rirmafPromise = require('rimraf-promise');

var onFulfilled = function() {
  console.log('Done.');
};

var onRejected = function(err) {
  console.warn(err);
};

rirmafPromise('path/to/file').then(onFulfilled, onRejected);
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[rimraf]: https://github.com/isaacs/rimraf
[promise]: http://promisesaplus.com/
