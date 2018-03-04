# Config Reader

> Node.js class, reads, merges, parsers and freezes multi-file config data.


## Getting Started

```shell
npm install --save @cork-labs/config-reader
```

```javascript
const emitterMixin = require('@cork-labs/config-reader');

const environment = process.env.NODE_ENV || 'development';
const configDir = process.env.CONFIG_DIR || './config';

const configReader = new ConfigReader();
configReader.readDataDir(path.join(configDir));
configReader.readVarsFile(path.join(configDir, 'vars.json'));
const config = configReader.getData();
```

### Data files

```json
// ./config/defaults.json
{
  "api": {
    "port": "<%port%>",
		"domain": "<%server.domain%>"
	}
}
```

### Variables

```json
// ./config/vars.json
{
	"server.domain": "example.com"
}
```

### Environment vars

Variables read from `process.env` override vars read from files.

Environment variable names are lowercased and `_` is replaced with `.`.

The env var `FOO_BAR` will override `foo.bar`.

You can either use [dotenv](https://npmjs.com/package/dotenv) to persist environment variables locally
and/or create a git ignored `.env.vars.json` file and use `readVarsFile()` to read it if present.

```
// .env
SERVER_DOMAIN=dev.example.com
```


## API

### readDataDir(dirName)

Reads all `.json` files in the directory, recursively, and merges all data together.

Uses lodash `_.mergeWith()`, modifying how arrays are merged:
- if a non-array property is being overriden by an array, it replaces the original.
- if merging an array with another array, the arrays are concatenated and then unique'd.

Attempting to read more data after `getData()` has been called will throw an exception.

Attempting to read a file twice will throw an exception.

### readVarsFile(fileName)

Reads a single variables file. If file does not exist it is ignored.

Attempting to read more data after `getData()` has been called will throw an exception.

Attempting to read a file twice will throw an exception.

### getData()

Prepares and returns a frozen data object.

- merges `process.env.xxx` into known variables (`FOO_BAR` becomes `foo.bar`)
- parses variables
- deep reezes data

After `getData()` has been called you can no longer read data using `readDataDir()` or `readVarsFile()`.


## Develop

```shell
# lint and fix
npm run lint

# run test suite
npm test

# lint and test
npm run build

# serve test coverage
npm run coverage

# publish a minor version
node_modules/.bin/npm-bump minor
```


### Contributing

We'd love for you to contribute to our source code and to make it even better than it is today!

Check [CONTRIBUTING](https://github.com/cork-labs/contributing/blob/master/CONTRIBUTING.md) before submitting issues and PRs.


## Links

- [npm-bump](https://www.npmjs.com/package/npm-bump)
- [chai](http://chaijs.com/api/)
- [sinon](http://sinonjs.org/)
- [sinon-chai](https://github.com/domenic/sinon-chai)


## [MIT License](LICENSE)

[Copyright (c) 2018 Cork Labs](http://cork-labs.mit-license.org/2018)
