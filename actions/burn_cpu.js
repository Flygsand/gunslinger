'use strict';

const _ = require('highland')
    , Event = require('../event');

module.exports = (ssh) => {
  return _.pipeline(
    ssh('sudo -b nohup sh -c "for i in {1..32}; do while true; do openssl speed; done & done" &>/dev/null'),
    _.map((i) => new Event(i.group, i.InstanceId, 'burn_cpu'))
  );
};
