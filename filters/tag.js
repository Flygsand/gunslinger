'use strict';

const _ = require('highland');

module.exports = (key) => {
  return _.filter((g) => {
    return g.tags.some((t) => t.Key === key);
  });
};
