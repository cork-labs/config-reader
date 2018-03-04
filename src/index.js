'use strict';

const fs = require('fs');
const path = require('path');

require('dotenv');
const _ = require('lodash');
const deepFreeze = require('deep-freeze');

class Config {
  constructor () {
    this._frozen = null;
    this._data = { };
    this._$vars = {};
  }

  // -- private

  _mergeArrays (objValue, srcValue) {
    if (_.isArray(srcValue)) {
      if (_.isArray(objValue)) {
        return _.uniqWith(objValue.concat(srcValue), _.isEqual);
      } else {
        return srcValue;
      }
    }
  }

  _mergeConfig (base, overrides) {
    return _.mergeWith(base, overrides, this._mergeArrays);
  }

  _readFile (fileName) {
    let contents = fs.readFileSync(fileName);
    return JSON.parse(contents);
  }

  _readFileIfExists (fileName) {
    if (!fs.existsSync(fileName)) {
      return {};
    } else {
      return this._readFile(fileName);
    }
  }

  _readDir (dirName) {
    var data = {};
    console.log('Config::readDir() scan', dirName);
    var files = fs.readdirSync(dirName);
    files.forEach((file) => {
      var configFile = path.resolve(path.join(dirName, file));
      if (this._files.indexOf(configFile) !== -1) {
        throw new Error(`ConfigReader::_readDir() File  "${configFile}" was already read.`);
      }
      var stats = fs.statSync(configFile);
      if (stats) {
        if (stats.isFile() && file.match(/\.json$/)) {
          this._mergeConfig(data, this._readFile(configFile));
        } else if (stats.isDirectory()) {
          this._readDir(configFile);
        }
      }
    });
    return data;
  }

  _parseVars (data, $vars) {
    let key;
    let matches;
    for (key in data) {
      if (typeof data[key] === 'object') {
        this._parseVars(data[key], $vars);
      } else if (typeof data[key] === 'string') {
        matches = data[key].match(/^<%([a-zA-Z0-9.-]+)%>$/);
        if (matches) {
          if (!(matches[1] in $vars)) {
            throw new Error(`ConfigReader::_parseVars() $var "${matches[1]}" is not defined`);
          } else {
            data[key] = $vars[matches[1]];
          }
        }
      }
    }
  }

  _readEnv () {
    Object.keys(process.env).sort().forEach(key => {
      let name = key.replace(/_/g, '.').toLowerCase();
      if (typeof this._$vars[name] !== 'undefined') {
        this._$vars[name] = process.env[key];
      }
    });
  }

  // -- public

  readDataDir (dirName) {
    if (this._frozen) {
      throw new Error(`Can not read more data after getData() has been called.`);
    }
    this._mergeConfig(this._data, this._readDir(dirName));
  }

  readVarsFile (fileName) {
    if (this._frozen) {
      throw new Error(`Can not read more data after getData() has been called.`);
    }
    this._mergeConfig(this._$vars, this._readFileIfExists(fileName));
  }

  getData () {
    if (!this._frozen) {
      this._readEnv();
      this._parseVars(this._data, this._$vars);
      deepFreeze(this._data);
      this._frozen = true;
    }
    return this._data;
  }
}

module.exports = Config;
