'use strict';

const EventEmitter = require('events').EventEmitter;

function request(data, next) {
  const req = new EventEmitter();
  req.send = () => {
    req.emit('complete', {
      data: data,
      hasNextPage: () => !!next,
      nextPage: () => next
    });
  };

  return req;
}

function requests(data) {
  let e = request(data[data.length - 1]);
  for (let i = data.length - 2; i >= 0; i--) {
    e = request(data[i], e);
  }

  return e;
}

module.exports = {
  requests: requests
};
