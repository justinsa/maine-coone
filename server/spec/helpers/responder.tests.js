/* globals afterEach, before, beforeEach, describe, it */
'use strict';
require('chai').should();
var _ = require('lodash'),
    sinon = require('sinon');

describe('responder', function () {
  var req = {},
      next = function () {},
      Responder = null,
      res = {
        headersSent: false,
        statusCode: undefined,
        send: undefined,
        sendStatus: undefined,
        type: undefined
      };

  before(function () {
    Responder = require('../../responder.js')(req, res, next);
  });

  beforeEach(function () {
    res.headersSent = false;
    res.statusCode = undefined;
    res.send = undefined;
    res.sendStatus = undefined;
    res.type = undefined;
  });

  it('should add a responder function to res', function () {
    _.has(res, 'responder').should.equal(true);
    _.isFunction(res.responder).should.equal(true);
  });

  it('should log a trace if headers already sent', function () {
    sinon.stub(console, 'trace');
    res.headersSent = true;
    res.responder(200);
    console.trace.calledOnce.should.equal(true);
    console.trace.calledWithExactly('Headers already sent. No further response permitted.').should.equal(true);
    console.trace.restore();
  });

  it('should handle a numeric status code', function () {
    res.sendStatus = sinon.stub();
    res.responder(204);
    res.sendStatus.calledOnce.should.equal(true);
    res.sendStatus.calledWithExactly(204).should.equal(true);
  });

  describe('status code handling', function () {
    beforeEach(function () {
      sinon.stub(console, 'warn');
      res.statusCode = undefined;
      res.sendStatus = sinon.stub();
    });

    afterEach(function () {
      console.warn.restore();
    });

    it('should log a warning if the status code is 200 and there is no content', function () {
      res.responder(200);
      res.sendStatus.calledOnce.should.equal(true);
      res.sendStatus.calledWithExactly(200).should.equal(true);
      console.warn.calledOnce.should.equal(true);
      console.warn.calledWithExactly('Status code 200 should have a body. Use 204 instead.').should.equal(true);
    });

    it('should default the status code to 200 if a non-numeric is provided', function () {
      var variants = [undefined, null, '200', {}, []],
          i;
      for (i = 0; i < variants.length; ++i) {
        res.responder(variants[i]);
        res.sendStatus.callCount.should.equal(i + 1);
      }
      console.warn.callCount.should.equal(variants.length);
      res.sendStatus.alwaysCalledWithExactly(200).should.equal(true);
    });
  });

  it('should handle a format with no content', function () {
    res.type = sinon.stub();
    res.sendStatus = sinon.stub();
    res.responder(300, 'json');
    res.type.calledOnce.should.equal(true);
    res.type.calledWithExactly('json').should.equal(true);
    res.sendStatus.calledOnce.should.equal(true);
    res.sendStatus.calledWithExactly(300).should.equal(true);
  });

  it('should handle an empty format with no content', function () {
    res.type = sinon.stub();
    res.sendStatus = sinon.stub();
    res.responder(300, '');
    res.type.calledOnce.should.equal(true);
    res.type.calledWithExactly('').should.equal(true);
    res.sendStatus.calledOnce.should.equal(true);
    res.sendStatus.calledWithExactly(300).should.equal(true);
  });

  it('should ignore a format that is not a string', function () {
    var variants = [undefined, null, 200, {}, []],
        i;
    res.type = sinon.stub();
    res.sendStatus = sinon.stub();
    for (i = 0; i < variants.length; ++i) {
      res.responder(300, variants[i]);
      res.type.callCount.should.equal(0);
      res.sendStatus.callCount.should.equal(i + 1);
    }
    res.sendStatus.alwaysCalledWithExactly(300).should.equal(true);
  });

  it('should handle content', function () {
    var obj = { a: 'b' };
    res.send = sinon.stub();
    res.responder(300, undefined, obj);
    res.statusCode.should.equal(300);
    res.send.calledOnce.should.equal(true);
    res.send.calledWithExactly(obj).should.equal(true);
  });
});
