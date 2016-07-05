'use strict';

const _ = require('highland');

module.exports = (store) => {
  return _.flatMap((e) => {
    return store.put(e.id, [
      { key: 'group', value: e.group },
      { key: 'instance', value: e.instance },
      { key: 'type', value: e.type},
      { key: 'time', value: e.time }
    ]);
  });
};
