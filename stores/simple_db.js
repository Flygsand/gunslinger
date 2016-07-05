'use strict';

const _ = require('highland')
    , AWS = require('aws-sdk')
    , util = require('util');

module.exports = (domain, db) => {
  db = db || new AWS.SimpleDB();

  return {
    query: (expr) => {
      let req = db.select({ SelectExpression: util.format(expr, domain) });

      return _((push, next) => {
        req.on('complete', (res) => {
          if (res.error) {
            push(res.error);
            push(null, _.nil);
          } else {
            (res.data.Items || []).forEach((i) => {
              push(null, {
                id: i.Name,
                attrs: i.Attributes.map((a) => ({ key: a.Name, value: a.Value }))
              });
            });

            if (res.hasNextPage()) {
              req = res.nextPage();
              next();
            } else {
              push(null, _.nil);
            }
          }
        });

        req.send();
      });
    },

    put: _.wrapCallback((id, attrs, done) => {
      db.putAttributes({
        DomainName: domain,
        ItemName: id,
        Attributes: attrs.map((a) => ({ Name: a.key, Value: a.value }))
      }, (err) => {
        done(err);
      });
    })
  };
};
