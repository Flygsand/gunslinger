'use strict';

const _ = require('highland')
    , Event = require('../event');

module.exports = (ssh) => {
  return _.pipeline(
    ssh('sudo -b nohup dd if=/dev/zero of=/fill &>/dev/null'),
    _.map((i) => new Event(i.group, i.InstanceId, 'fill_disk'))
  );
};
