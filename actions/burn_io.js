'use strict';

const _ = require('highland')
    , Event = require('../event');

module.exports = (ssh) => {
  return _.pipeline(
    ssh('sudo -b nohup sh -c "while true; do dd if=/dev/urandom of=/burn bs=1M count=1024 iflag=fullblock; done" &>/dev/null'),
    _.map((i) => new Event(i.group, i.InstanceId, 'burn_io'))
  );
};
