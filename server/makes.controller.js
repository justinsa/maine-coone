'use strict';
module.exports = ['data', function (data) {
  return {
    '/': {
      get: function () {
        return data.query.distinct(data.Recall, 'Make');
      }
    }
  };
}];