/* globals afterEach, before, beforeEach, describe, it */
'use strict';
require('chai').should();
var nodejection = require('nodejection'),
    sinon = require('sinon');

describe('application', function () {
  var RecallsController = require('../../recalls.controller.js');
  var sandbox,
      data = {
        Recall: null,
        utils: null
      };

  before(function () {
    nodejection.register('data', data);
    return nodejection.inject(RecallsController)
    .then(function (controller) {
      RecallsController = controller;
    });
  });

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    data.Recall = {
      count: sinon.stub(),
      find: sinon.stub()
    };
    data.utils = {
      inFilter: sinon.stub(),
      operation: sinon.stub(),
      pagination: sinon.stub(),
      rangeFilter: sinon.stub()
    };
  });

  afterEach(function () {
    sandbox.restore();
    sandbox = null;
    data.Recall = null;
    data.utils = null;
  });

  it('should have known route functions', function () {
    RecallsController['/:operation?'].get.should.be.a.Function; // jshint ignore:line
  });

  describe('GET', function () {
    describe('Index', function () {
      it('should return list when no parameters provided', function () {
        var query = {
          skip: sinon.stub(),
          sort: sinon.stub()
        };
        query.sort.returns({
          exec: function (cb) {
            cb(undefined, ['model', 'model']);
          }
        });
        data.Recall.find.returns(query);
        return RecallsController['/:operation?'].get({ params: {}, query: {} }).then(function (result) {
          data.utils.operation.calledOnce.should.equal(true);
          data.utils.operation.calledWith({}).should.equal(true);
          data.utils.pagination.calledOnce.should.equal(true);
          data.utils.pagination.calledWith({}).should.equal(true);
          data.utils.rangeFilter.calledOnce.should.equal(true);
          data.utils.rangeFilter.calledWith('Year', undefined, undefined).should.equal(true);
          data.utils.inFilter.calledOnce.should.equal(true);
          data.utils.inFilter.calledWith('Make', undefined).should.equal(true);
          query.skip.calledOnce.should.equal(false);
          result.should.eql([200, undefined, ['model', 'model']]);
        });
      });
    });
  });
});