'use strict';

const _ = require('highland')
  , AWS = require('aws-sdk');

module.exports = (as) => {
  as = as || new AWS.AutoScaling();
  let req = as.describeAutoScalingGroups();

  return _((push, next) => {
    req.on('complete', (res) => {
      if (res.error) {
        push(res.error);
        push(null, _.nil);
      } else {
        res.data.AutoScalingGroups.forEach((g) => {
          push(null, {
            id: g.AutoScalingGroupName,
            instances: g.Instances.map((i) => _.extend(i, { group: g.AutoScalingGroupName, healthy: i.HealthStatus === 'Healthy' })),
            tags: g.Tags
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
};
