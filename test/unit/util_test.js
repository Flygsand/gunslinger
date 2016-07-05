'use strict';

const expect = require('chai').expect
    , sinon = require('sinon')
    , _ = require('highland')
    , util = require('../../util');

describe('util', () => {
  describe('fan', () => {
    const fan = util.fan;

    it('fans out to multiple transform streams', (done) => {
      const add = _.pipeline(_.map((x) => x + 1))
          , mul = _.pipeline(_.map((x) => x * 2))
          , sub = _.pipeline(_.map((x) => x - 1));

      _([1, 2, 3]).through(fan([add, mul, sub])).toArray((xs) => {
        expect(xs).to.eql([2, 2, 0, 3, 4, 1, 4, 6, 2]);
        done();
      });
    });
  });

  describe('spread', () => {
    const spread = util.spread;

    it('spreads over multiple transform streams', (done) => {
      const random = sinon.stub();
      random.onFirstCall().returns(0.3);
      random.onSecondCall().returns(0.5);
      random.onThirdCall().returns(0.7);

      const add = _.pipeline(_.map((x) => x + 1))
          , mul = _.pipeline(_.map((x) => x * 2))
          , sub = _.pipeline(_.map((x) => x - 1));

      _([1, 2, 3]).through(spread([add, mul, sub], random)).toArray((xs) => {
        expect(xs).to.eql([2, 4, 2]);
        done();
      });
    });
  });
});
