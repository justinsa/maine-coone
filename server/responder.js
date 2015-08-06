'use strict';
var _ = require('lodash');

module.exports = function (req, res, next) {
  res.responder = function (code) {
    if (res.headersSent) {
      console.warning('Headers already sent.');
    } else {
      if (arguments.length > 1) {
        var format = 'json', index = 1;
        switch (arguments[1]) {
          case 'html':
            format = 'send';
            index = 2;
            break;
          case 'json':
            index = 2;
            break;
        }
        res.status(code)[format](arguments[index]);
      } else if (!_.isNumber(code)) {
        res.status(200).json(code);
      } else {
        if (code === 200) {
          console.warning('Status codes of 200 should have a body. Use 204 instead.');
        }
        res.status(code).end();
      }
    }
  };

  res.onend = function (callback) {
    res.on('finish', callback);
  };

  next();
};