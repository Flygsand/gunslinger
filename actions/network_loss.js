'use strict';

const _ = require('highland')
    , Event = require('../event');

module.exports = (ssh) => {
  return _.pipeline(
    ssh('sudo tc qdisc replace dev eth0 root netem loss 7% 25%'),
    _.map((i) => new Event(i.group, i.InstanceId, 'network_loss'))
  );
};
