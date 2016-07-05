'use strict';

const expect = require('chai').expect
    , _ = require('highland')
    , wrapUnarmed = require('../../../actions/wrap_unarmed');

describe('actions/wrap_unarmed', () => {
  it('wraps an action', (done) => {
    _([
      { InstanceId: 'i-deadbeef', PrivateIpAddress: '127.0.0.1', group: 'asg1' },
      { InstanceId: 'i-deadcafe', PrivateIpAddress: '1.2.3.4', group: 'asg2' }
    ])
    .through(wrapUnarmed('destruction'))
    .toArray((events) => {
      expect(events[0].group).to.eql('asg1');
      expect(events[0].instance).to.eql('i-deadbeef');
      expect(events[0].type).to.eql('wrap_unarmed(destruction)');
      expect(events[1].group).to.eql('asg2');
      expect(events[1].instance).to.eql('i-deadcafe');
      expect(events[1].type).to.eql('wrap_unarmed(destruction)');
      done();
    });
  });
});
