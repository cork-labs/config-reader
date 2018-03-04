'use strict';

const chai = require('chai');
const expect = chai.expect;
// const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const ConfigReader = require('../src/index');

describe('ConfigReader', function () {
  it('should be a function', function () {
    expect(ConfigReader).to.be.a('function');
  });

  describe('api', function () {
    beforeEach(function () {
      this.configReader = new ConfigReader();
    });

    it('should expose the methods', function () {
      expect(this.configReader.readDataDir).to.be.a('function');
      expect(this.configReader.readVarsFile).to.be.a('function');
      expect(this.configReader.getData).to.be.a('function');
    });

    describe('when getData() is invoked', function () {
      beforeEach(function () {
        this.data = this.configReader.getData();
      });

      it('should return an object', function () {
        expect(this.data).to.be.an('object');
      });
    });
  });
});
