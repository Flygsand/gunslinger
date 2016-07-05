'use strict';

const expect = require('chai').expect
    , _ = require('highland')
    , redundancy = require('../../../filters/redundancy');

describe('filters/redundancy', () => {
  it('filters out groups based on healthy instance count', (done) => {
    _([
      { id: 'asg1', instances: [{healthy: true}, {healthy: false}] },
      { id: 'asg2', instances: [] },
      { id: 'asg3', instances: [{healthy: true}, {healthy: true}, {healthy: false}]}
    ])
    .through(redundancy(2))
    .toArray((groups) => {
      expect(groups[0].id).to.eql('asg3');
      done();
    });
  });
});
