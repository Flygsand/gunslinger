'use strict';

const _ = require('highland')
    , AWS = require('aws-sdk')
    , Event = require('../event');

module.exports = (ssh, ec2) => {
  ec2 = ec2 || new AWS.EC2();

  return _.flatMap(_.wrapCallback((i, done) => {
    ec2.terminateInstances({
      InstanceIds: [
        i.InstanceId
      ]
    }, (err) => {
      if (err) {
        done(err);
      } else {
        done(null, new Event(i.group, i.InstanceId, 'terminate'));
      }
    });
  }));
};
