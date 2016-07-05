'use strict';

const chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , _ = require('highland')
    , invoker = require('../../invoker');
chai.use(require('sinon-chai'));

describe('invoker', () => {
  it('invokes an action', (done) => {
    const describeInstances = sinon.stub()
        , ssh = sinon.stub()
        , action = sinon.spy((ssh) => ssh('command'));

    describeInstances.onFirstCall().callsArgWith(1, null, {
      Reservations: [
        {
          Instances: [
            { InstanceId: 'i-deadbeef', PrivateIpAddress: '127.0.0.1' },
          ]
        }
      ]
    });
    describeInstances.onSecondCall().callsArgWith(1, null, {
      Reservations: [
        {
          Instances: [
            { InstanceId: 'i-deadcafe', PrivateIpAddress: '1.2.3.4' },
          ]
        }
      ]
    });

    ssh.onFirstCall().returns(_([]));
    ssh.onSecondCall().returns(_([]));

    _([
      { InstanceId: 'i-deadbeef', group: 'foo' },
      { InstanceId: 'i-deadcafe', group: 'bar' }
    ])
    .through(invoker([action], {}, {describeInstances: describeInstances}, ssh))
    .done(() => {
      expect(ssh).to.have.been.calledWith({InstanceId: 'i-deadbeef', PrivateIpAddress: '127.0.0.1', group: 'foo'}, 'command');
      expect(ssh).to.have.been.calledWith({InstanceId: 'i-deadcafe', PrivateIpAddress: '1.2.3.4', group: 'bar'}, 'command');
      done();
    });
  });
});
