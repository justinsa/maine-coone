/* globals afterEach, before, beforeEach, describe, it */
'use strict';
require('chai').should();
var nodejection = require('nodejection'),
    sinon = require('sinon'),
    Promise = require('bluebird');

describe('years', function () {
  var YearsController = require('../../years.controller.js');
  var sandbox, data = {
    Recall: 'model'
  };

  before(function () {
    nodejection.register('data', data);
    return nodejection.inject(YearsController)
    .then(function (controller) {
      YearsController = controller;
    });
  });

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    data.query = {
      distinct: sandbox.stub()
    };
  });

  afterEach(function () {
    sandbox.restore();
    sandbox = null;
    data.query = null;
  });

  it('should have known route functions', function () {
    YearsController['/'].get.should.be.a.Function; // jshint ignore:line
  });

  describe('GET', function () {
    describe('Index', function () {
      it('should return results', function () {
        data.query.distinct.returns(Promise.resolve({ rows: [] }));
        return YearsController['/'].get({}).then(function (result) {
          data.query.distinct.calledOnce.should.equal(true);
          data.query.distinct.calledWithExactly(data.Recall, 'Year').should.equal(true);
          result.should.eql({ rows: [] });
        });
      });
    });
  });
});