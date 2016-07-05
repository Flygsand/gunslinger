'use strict';

const _ = require('highland')
    , Event = require('../event');

module.exports = (action) => {
  return _.map((i) => new Event(i.group, i.InstanceId, `wrap_unarmed(${action})`));
};
