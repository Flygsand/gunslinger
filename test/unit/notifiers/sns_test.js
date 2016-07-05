'use strict';

const chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , _ = require('highland')
    , sns = require('../../../notifiers/sns')
    , Event = require('../../../event');
chai.use(require('sinon-chai'));

describe('notifiers/sns', () => {
  it('publishes events', (done) => {
    const events = [
      new Event('group1', 'i-deadbeef', 'foo', 'deadbeef', '2016-07-03T08:28:01.220Z'),
      new Event('group2', 'i-deadcafe', 'bar', 'deadcafe', '2016-07-04T08:27:57.350Z')
    ],
    publish = sinon.stub().callsArg(1);

    _(events)
    .through(sns('mytopic', {
      publish: publish
    }))
    .toArray((es) => {
      expect(es).to.eql(events);
      expect(publish).to.have.been.calledWith({
        Message: '{"group":"group1","instance":"i-deadbeef","type":"foo","id":"deadbeef","time":"2016-07-03T08:28:01.220Z"}',
        TopicArn: 'mytopic'
      });
      expect(publish).to.have.been.calledWith({
        Message: '{"group":"group2","instance":"i-deadcafe","type":"bar","id":"deadcafe","time":"2016-07-04T08:27:57.350Z"}',
        TopicArn: 'mytopic'
      });
      done();
    });
  });
});
