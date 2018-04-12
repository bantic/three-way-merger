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

  describe('#remove(dep)', function() {
    it('removes from array and decrements length', function() {
      var set = DependencySet.fromJSON(json.devDependencies);

      var dep = set.remove('mocha');

      expect(dep.name).to.equal('mocha');
      expect(set.toArray().length).to.equal(1);
      expect(set.length).to.equal(1);
    });
  });
});
