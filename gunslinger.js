'use strict';

const _ = require('highland')
    , util = require('./util')
    , invoker = require('./invoker')
    , recorder = require('./recorder');

function get(path, config) {
  let n, args;
  if (Array.isArray(config)) {
    n = config[0];
    args = config.slice(1);
  } else {
    n = config;
    args = [];
  }

  args.unshift(require(path + n));
  return _.partial.apply(_, args);
}

function validate(config) {
  if (!config.store) {
    throw new Error('store must be configured!');
  }
}

module.exports = (config) => {
  validate(config);

  const store = get('./stores/', config.store)()
      , notifier = config.notifier ? get('./notifiers/', config.notifier) : null
      , grouper = get('./groupers/', config.grouper || 'asg')
      , filters = (config.filters || []).map((c) => get('./filters/', c))
      , actions = (config.actions || []).map((c) => get('./actions/', config.armed ? c : ['wrap_unarmed', c]));

  return (event, context, done) => {
    const pl = [];

    pl.push(grouper());
    filters.forEach((f) => pl.push(f(store)));
    pl.push(_.map((g) => util.pick(g.instances)));
    pl.push(invoker(actions, config.ssh));
    pl.push(_.doto(console.log));

    if (notifier) {
      pl.push(util.fan([
        recorder(store),
        notifier()
      ]));
    } else {
      pl.push(recorder(store));
    }

    if (!config.armed) {
      console.warn('unarmed!');
    }
    _.pipeline.apply(_, pl).reduce([], (es, e) => es.concat([e])).toCallback(done);
  };
};
