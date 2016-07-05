'use strict';

const chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , _ = require('highland')
    , actionLimit = require('../../../filters/action_limit');
chai.use(require('sinon-chai'));

describe('filters/action_limit', () => {
  it('filters out groups that have been acted upon more than a given limit since a point in time', (done) => {
    const query = sinon.stub();
    query
      .withArgs(sinon.match("select * from %s where group = 'asg1' and time > '2016-07-04T08:27:57.350Z'"))
      .returns(_([{ id: 'event1', attrs: [{ key: 'group', value: 'asg1' }, { key: 'time', value: 5000 }]}]));
    query
      .withArgs(sinon.match("select * from %s where group = 'asg2' and time > '2016-07-04T08:27:57.350Z'"))
      .returns(_([{ id: 'event2', attrs: [{ key: 'group', value: 'asg2' }, { key: 'time', value: 1234 }]}]));
    query
      .withArgs("select * from %s where group = 'asg3' and time > '2016-07-04T08:27:57.350Z'").returns(_([]));

    _([
      { id: 'asg1' },
      { id: 'asg2' },
      { id: 'asg3' }
    ])
    .through(actionLimit(1, {
      query: query
    }, '2016-07-04T08:27:57.350Z'))
    .toArray((groups) => {
      expect(query).to.have.been.calledWith("select * from %s where group = 'asg1' and time > '2016-07-04T08:27:57.350Z'");
      expect(query).to.have.been.calledWith("select * from %s where group = 'asg2' and time > '2016-07-04T08:27:57.350Z'");
      expect(query).to.have.been.calledWith("select * from %s where group = 'asg3' and time > '2016-07-04T08:27:57.350Z'");
      expect(groups).to.eql([
        { id: 'asg3' }
      ]);
      done();
    });
  });
});
