'use strict';

const _ = require('highland')
    , Event = require('../event');

module.exports = (ssh) => {
  return _.pipeline(
    ssh('sudo tc qdisc replace dev eth0 root netem delay 1000ms 500ms'),
    _.map((i) => new Event(i.group, i.InstanceId, 'network_latency'))
  );
};
