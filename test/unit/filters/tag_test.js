'use strict';

const expect = require('chai').expect
    , _ = require('highland')
    , tag = require('../../../filters/tag');

describe('filters/tag', () => {
  it('filters out groups that do not have a given tag key', (done) => {
    _([
      {
        id: 'asg1',
        tags: [
          { Key: 'foo', Value: '123' },
          { Key: 'bar', Value: '456' }
        ]
      },
      {
        id: 'asg2',
        tags: []
      },
      {
        id: 'asg3',
        tags: [
          { Key: 'baz', Value: '789' }
        ]
      }
    ])
    .through(tag('foo'))
    .toArray((groups) => {
      expect(groups.length).to.eql(1);
      expect(groups[0].id).to.eql('asg1');
      done();
    });
  });
});
