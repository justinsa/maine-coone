/* globals before, describe, it */
'use strict';
require('chai').should();
var nodejection = require('nodejection'),
    proxyquire = require('proxyquire').noCallThru();

describe('diagnostic', function () {
  var DiagnosticController,
      configuration = {
        key1: {
          key2: true
        },
        key3: false
      };

  before(function () {
    nodejection.register('configuration', configuration);
    return nodejection.inject(
      proxyquire(
        '../../diagnostic.controller.js',
        {
          'child_process': {
            exec: function (cmd, cb) {
              cb(undefined, cmd);
            }
          }
        })
    ).then(function (controller) {
      DiagnosticController = controller;
    });
  });

  it('should have known route functions', function () {
    DiagnosticController['/'].get.should.be.a.Function; // jshint ignore:line
    DiagnosticController['/coffee'].get.should.be.a.Function; // jshint ignore:line
    DiagnosticController['/configuration/:key'].get.should.be.a.Function; // jshint ignore:line
    DiagnosticController['/versions/:type'].get.should.be.a.Function; // jshint ignore:line
  });

  describe('GET', function () {
    describe('Index', function () {
      it('should return 204 always', function () {
        DiagnosticController['/'].get().should.equal(204);
      });
    });

    describe('Coffee', function () {
      it('should return 418 always', function () {
        DiagnosticController['/coffee'].get().should.equal(418);
      });
    });

    describe('Configuration', function () {
      it('should return top-level key', function () {
        var req = { params: { key: 'key3' }};
        DiagnosticController['/configuration/:key'].get(req).should.eql([200, undefined, false]);
      });

      it('should return nested key value', function () {
        var req = { params: { key: 'key1.key2' }};
        DiagnosticController['/configuration/:key'].get(req).should.eql([200, undefined, true]);
      });

      it('should return 404 when key unknown', function () {
        var req = { params: { key: 'key4' }};
        DiagnosticController['/configuration/:key'].get(req).should.equal(404);
      });
    });

    describe('Version', function () {
      it('should perform bower call', function (done) {
        var req = { params: { type: 'bower' }};
        DiagnosticController['/versions/:type'].get(req).then(function (output) {
          output.should.eql([200, 'text', 'bower list']);
          done();
        });
      });

      it('should perform npm call', function (done) {
        var req = { params: { type: 'npm' }};
        DiagnosticController['/versions/:type'].get(req).then(function (output) {
          output.should.eql([200, 'text', 'npm list']);
          done();
        });
      });

      it('should return 404 when type unknown', function () {
        var req = { params: { type: 'potato' }};
        DiagnosticController['/versions/:type'].get(req).should.equal(404);
      });
    });
  });
});