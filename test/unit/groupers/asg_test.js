'use strict';

const expect = require('chai').expect
    , sinon = require('sinon')
    , requests = require('../../aws').requests
    , asg = require('../../../groupers/asg');

describe('groupers/asg', () => {
  it('yields auto scaling groups', (done) => {
    asg({
      describeAutoScalingGroups: () => requests([
        { AutoScalingGroups: [{ AutoScalingGroupName: 'asg1', Instances: [] }] },
        { AutoScalingGroups: [{ AutoScalingGroupName: 'asg2', Instances: [] }] },
        { AutoScalingGroups: [{ AutoScalingGroupName: 'asg3', Instances: [] }] }
      ])
    })
    .toArray((groups) => {
      expect(groups.length).to.eql(3);
      expect(groups[0].id).to.eql('asg1');
      expect(groups[1].id).to.eql('asg2');
      expect(groups[2].id).to.eql('asg3');
      done();
    });
  });
});
