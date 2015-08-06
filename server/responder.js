'use strict';
var _ = require('lodash');

module.exports = function (req, res, next) {
  res.responder = function (code, format, content) {
    if (res.headersSent) {
      console.trace('Headers already sent. No further response permitted.');
    } else {
      if (!_.isNumber(code)) {
        code = 200;
      }

      if (_.isString(format)) {
        res.type(format);
      }

      if (content) {
        res.status(code).send(content);
      } else {
        if (code === 200) {
          console.warning('Status code 200 should have a body. Use 204 instead.');
        }
        res.sendStatus(code);
      }
    }
  };

  next();
};