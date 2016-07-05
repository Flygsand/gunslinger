'use strict';

const chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , _ = require('highland')
    , killProcesses = require('../../../actions/kill_processes');
chai.use(require('sinon-chai'));

describe('actions/kill_processes', () => {
  it('launches a command', (done) => {
    const instances = [
      { InstanceId: 'i-deadbeef', PrivateIpAddress: '127.0.0.1', group: 'asg1' },
      { InstanceId: 'i-deadcafe', PrivateIpAddress: '1.2.3.4', group: 'asg2' }
    ]
        , ssh = sinon.stub().returns(_(instances));

    _(instances)
    .through(killProcesses(['docker', 'etcd'], ssh))
    .toArray((events) => {
      expect(ssh).to.have.been.calledWith('sudo -b nohup sh -c "while true; do pkill -KILL docker; pkill -KILL etcd; sleep 1; done" &>/dev/null');
      expect(events[0].group).to.eql('asg1');
      expect(events[0].instance).to.eql('i-deadbeef');
      expect(events[0].type).to.eql('kill_processes');
      expect(events[1].group).to.eql('asg2');
      expect(events[1].instance).to.eql('i-deadcafe');
      expect(events[1].type).to.eql('kill_processes');
      done();
    });
  });
});



