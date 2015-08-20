# rimraf-promise

[![NPM version](https://img.shields.io/npm/v/rimraf-promise.svg)](https://www.npmjs.com/package/rimraf-promise)
[![Build Status](https://travis-ci.org/shinnn/rimraf-promise.svg?branch=master)](https://travis-ci.org/shinnn/rimraf-promise)
[![Build status](https://ci.appveyor.com/api/projects/status/sa0vd3nhfiupeu7h?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/rimraf-promise)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/rimraf-promise.svg)](https://coveralls.io/r/shinnn/rimraf-promise)
[![Dependency Status](https://img.shields.io/david/shinnn/rimraf-promise.svg?label=deps)](https://david-dm.org/shinnn/rimraf-promise)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/rimraf-promise.svg?label=devDeps)](https://david-dm.org/shinnn/rimraf-promise#info=devDependencies)

[Promises/A+][promise] version of [rimraf][rimraf]:

> `rm -rf` for node.

```javascript
const rimrafPromise = require('rimraf-promise');

rimrafPromise('path/should/be/removed')
.then(() => console.log('File has been removed successfully.'))
.catch(console.error);
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install rimraf-promise
```

## API

```javascript
const rimrafPromise = require('rimraf-promise');
```

### rimrafPromise(*path* [, *options*])

*path*: `String` (a file/directory path or glob pattern)  
*options*: `Object` (rimraf [options](https://github.com/isaacs/rimraf/blob/4d3d9b5f2ddbbaf4ee56be5f8bfecdd4e27f7b34/rimraf.js#L22-L38))  
Return: `Object` ([Promise][promise])

When it finish removing the target, it will be [*fulfilled*](https://promisesaplus.com/#point-26) with no arguments.

When it fails to remove the target, it will be [*rejected*](https://promisesaplus.com/#point-30) with an error as its first argument. [Here](https://github.com/isaacs/rimraf#api) is the details about how [rimraf][rimraf] handles its error.

```javascript
const rirmafPromise = require('rimraf-promise');

const onFulfilled = () => console.log('Done.');
const onRejected = err => console.error(err);

rirmafPromise('path/to/file').then(onFulfilled, onRejected);
```

## License

[The Unlicense](./LICENSE)

[rimraf]: https://github.com/isaacs/rimraf
[promise]: https://promisesaplus.com/
