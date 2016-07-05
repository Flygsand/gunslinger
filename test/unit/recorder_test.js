'use strict';

const chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , _ = require('highland')
    , recorder = require('../../recorder');
chai.use(require('sinon-chai'));

describe('recorder', () => {
  it('stores events', (done) => {
    let put = sinon.spy(() => _([]));

    _([
      { id: 'event1', group: 'asg1', instance: 'i1', type: 'foo', time: '2016-07-03T08:28:01.220Z' },
      { id: 'event2', group: 'asg2', instance: 'i2', type: 'bar', time: '2016-07-04T08:27:57.350Z' }
    ])
    .through(recorder({
      put: put
    }))
    .done(() => {
      expect(put).to.have.been.calledWith('event1', [
        { key: 'group', value: 'asg1' },
        { key: 'instance', value: 'i1' },
        { key: 'type', value: 'foo' },
        { key: 'time', value: '2016-07-03T08:28:01.220Z' }
      ]);
      expect(put).to.have.been.calledWith('event2', [
        { key: 'group', value: 'asg2' },
        { key: 'instance', value: 'i2' },
        { key: 'type', value: 'bar' },
        { key: 'time', value: '2016-07-04T08:27:57.350Z' }
      ]);
      done();
    });
  });
});
