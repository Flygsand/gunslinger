'use strict';

const chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , _ = require('highland')
    , terminate = require('../../../actions/terminate');
chai.use(require('sinon-chai'));

describe('actions/terminate', () => {
  it('terminates instances', (done) => {
    const instances = [
      { InstanceId: 'i-deadbeef', PrivateIpAddress: '127.0.0.1', group: 'asg1' },
      { InstanceId: 'i-deadcafe', PrivateIpAddress: '1.2.3.4', group: 'asg2' }
    ]
        , terminateInstances = sinon.stub().callsArg(1);

    _(instances)
    .through(terminate(null, {terminateInstances: terminateInstances}))
    .toArray((events) => {
      expect(terminateInstances).to.have.been.calledTwice; // jshint ignore:line
      done();
    });
  });
});
