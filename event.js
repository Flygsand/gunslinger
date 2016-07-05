'use strict';

const uuid = require('node-uuid')
    , moment = require('moment');

class Event {
  constructor(group, instance, type, id, time) {
    this.group = group;
    this.instance = instance;
    this.type = type;
    this.id = id || uuid.v4();
    this.time = time || moment.utc().toISOString();
  }
}

module.exports = Event;
