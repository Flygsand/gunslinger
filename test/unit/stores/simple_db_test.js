'use strict';

const chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , requests = require('../../aws').requests
    , simpleDb = require('../../../stores/simple_db');
chai.use(require('sinon-chai'));

describe('stores/simple_db', () => {
  it('queries items', (done) => {
    const store = simpleDb('test', {
      select: () => requests([
        { Items: [{ Name: 'foo', Attributes: [{ Name: 'bar', Value: '1' }]}] },
        { Items: [{ Name: 'baz', Attributes: [{ Name: 'bar', Value: '2' }]}] }
      ])
    });

    store.query('select * from %s').toArray((xs) => {
      expect(xs).to.eql([
        { id: 'foo', attrs: [{ key: 'bar', value: '1' }]},
        { id: 'baz', attrs: [{ key: 'bar', value: '2' }]}
      ]);
      done();
    });
  });

  it('puts items', (done) => {
    const putAttributes = sinon.stub().callsArg(1)
        , store = simpleDb('test', {
            putAttributes: putAttributes
          });
    store.put('deadbeef', [{key: 'bar', value: 'baz'}]).done(() => {
      expect(putAttributes).to.have.been.calledWith({
        DomainName: 'test',
        ItemName: 'deadbeef',
        Attributes: [
          { Name: 'bar', Value: 'baz'}
        ]
      });
      done();
    });
  });
});
