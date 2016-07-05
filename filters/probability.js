'use strict';

const _ = require('highland');

module.exports = (p, store, random) => {
  random = random || Math.random;
  return _.filter(() => random() <= p);
};
