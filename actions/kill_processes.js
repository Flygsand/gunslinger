'use strict';

const _ = require('highland')
    , Event = require('../event');

module.exports = (ps, ssh) => {
  return _.pipeline(
    ssh(`sudo -b nohup sh -c "while true; do ${ps.map((p) => 'pkill -KILL ' + p).join('; ')}; sleep 1; done" &>/dev/null`),
    _.map((i) => new Event(i.group, i.InstanceId, 'kill_processes'))
  );
};
