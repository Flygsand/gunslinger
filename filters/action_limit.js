'use strict';

const _ = require('highland')
    , moment = require('moment');

module.exports = (n, store, since) => {
  since = since || moment.utc().subtract(1, 'day').toISOString();

  return _.flatFilter((g) => {
    return store.query(`select * from %s where group = '${g.id}' and time > '${since}'`).map(() => false).append(true);
  });
};
