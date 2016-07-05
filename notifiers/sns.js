'use strict';

const _ = require('highland')
    , AWS = require('aws-sdk');

module.exports = (topic, sns) => {
  sns = sns || new AWS.SNS();

  const publish = _.wrapCallback((e, done) => {
    sns.publish({
      Message: JSON.stringify(e),
      TopicArn: topic
    }, (err, data) => {
      done(err, e);
    });
  });

  return _.flatMap(publish);
};
