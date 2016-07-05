'use strict';

const expect = require('chai').expect
    , sinon = require('sinon')
    , _ = require('highland')
    , probability = require('../../../filters/probability');

describe('filters/probability', () => {
  it('filters out groups based on a set probability', (done) => {
    const random = sinon.stub();
    random.onFirstCall().returns(0.4);
    random.onSecondCall().returns(0.6);
    random.onThirdCall().returns(0.5);

    _([
      { id: 'asg1' },
      { id: 'asg2' },
      { id: 'asg3' }
    ])
    .through(probability(0.5, null, random))
    .toArray((groups) => {
      expect(groups).to.eql([
        { id: 'asg1' },
        { id: 'asg3' }
      ]);
      done();
    });
  });
});
