/* global describe, it */

var expect = require('chai').expect;
var DependencySet = require('../lib/dependency-set');

describe('Dependency Set', function() {
  it('exists', function() {
    expect(DependencySet).to.be.ok;
  });

  var json = {
    name: '...',
    devDependencies: {
      'mocha': '2.3.0',
      'should': '1.0'
    }
  };

  describe('#contains(name)', function() {
    it('is true if the dependency is in the set', function() {
      var set = DependencySet.fromJSON(json.devDependencies);
      expect(set.contains('mocha')).to.be.true;
      expect(set.contains('should')).to.be.true;
      expect(set.contains('other')).to.be.false;
    });
  });
});
