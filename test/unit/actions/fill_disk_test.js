'use strict';

const chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , _ = require('highland')
    , fillDisk = require('../../../actions/fill_disk');
chai.use(require('sinon-chai'));

describe('actions/fill_disk', () => {
  it('launches a command', (done) => {
    const instances = [
      { InstanceId: 'i-deadbeef', PrivateIpAddress: '127.0.0.1', group: 'asg1' },
      { InstanceId: 'i-deadcafe', PrivateIpAddress: '1.2.3.4', group: 'asg2' }
    ]
        , ssh = sinon.stub().returns(_(instances));

    _(instances)
    .through(fillDisk(ssh))
    .toArray((events) => {
      expect(ssh).to.have.been.calledWith('sudo -b nohup dd if=/dev/zero of=/fill &>/dev/null');
      expect(events[0].group).to.eql('asg1');
      expect(events[0].instance).to.eql('i-deadbeef');
      expect(events[0].type).to.eql('fill_disk');
      expect(events[1].group).to.eql('asg2');
      expect(events[1].instance).to.eql('i-deadcafe');
      expect(events[1].type).to.eql('fill_disk');
      done();
    });
  });
});


