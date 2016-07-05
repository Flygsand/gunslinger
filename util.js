'use strict';

const _ = require('highland');

function pick(arr, random) {
  random = random || Math.random;
  return arr[Math.floor(random()*arr.length)];
}

function fan(streams) {
  return _.through((s) => {
    const sources = streams.map(() => s.fork())
        , sinks = sources.map((s, i) => s.through(streams[i]));
     return _(sinks).merge();
  });
}

function spread(streams, random) {
  return _.through((s) => {
    const sources = streams.map(() => _())
        , sinks = sources.map((s, i) => s.through(streams[i]))
        , errors = s.consume((err, x, push, next) => {
      if (err) {
        push(err);
        next();
      } else if (x === _.nil) {
        sources.forEach((s) => s.end());
        push(null, _.nil);
      } else {
        pick(sources, random).write(x);
        next();
      }
    });

    return _(sinks).append(errors).merge();
  });
}

module.exports = {
  pick: pick,
  fan: fan,
  spread: spread
};
