'use strict';

const _ = require('highland');

module.exports = (n) => {
  return _.filter((g) => {
    return g.instances.filter((i) => i.healthy).length >= n;
  });
};
