/* global describe, it */

var expect = require('chai').expect;
var Diff = require('../lib/diff');
var DependencySet = require('../lib/dependency-set');
function createDiff(json) {
  var from = DependencySet.fromJSON(json.from);
  var to = DependencySet.fromJSON(json.to);

  return Diff.create({
    from: from,
    to: to
  });
}

describe('Diff', function() {
  it('exists', function() {
    expect(Diff).to.be.ok;
  });

  describe('equivalent sets', function() {
    var json = {
      from: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      to: {
        'mocha': '2.3.0',
        'should': '1.0'
      }
    };

    it('has nothing added removed or changed', function() {
      var diff = createDiff(json);

      expect(diff.added.length).to.equal(0);
      expect(diff.removed.length).to.equal(0);
      expect(diff.changed.length).to.equal(0);
    });
  });

  describe('added dependency', function() {
    var json = {
      from: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      to: {
        'mocha': '2.3.0',
        'should': '1.0',
        'other': '1.1'
      }
    };

    it('includes the added deps', function() {
      var diff = createDiff(json);
      expect(diff.removed.length).to.equal(0);
      expect(diff.changed.length).to.equal(0);

      expect(diff.added.length).to.equal(1);
      var dep = diff.added.get('other');
      expect(dep.version).to.equal('1.1');
    });
  });

  describe('removed dep', function() {
    var json = {
      from: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      to: {
        'mocha': '2.3.0'
      }
    };

    it('includes the removed deps', function() {
      var diff = createDiff(json);

      expect(diff.added.length).to.equal(0);
      expect(diff.changed.length).to.equal(0);
      expect(diff.removed.length).to.equal(1);

      var dep = diff.removed.get('should');
      expect(dep.version).to.equal('1.0');
    });
  });

  describe('changed version numbers', function() {
    var json = {
      from: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      to: {
        'mocha': '2.3.0',
        'should': '2.0'
      }
    };

    it('includes the changed deps', function() {
      var diff = createDiff(json);
      expect(diff.added.length).to.equal(0);
      expect(diff.removed.length).to.equal(0);

      expect(diff.changed.length).to.equal(1);
      var dep = diff.changed.get('should');
      expect(dep.fromVersion).to.equal('1.0');
      expect(dep.version).to.equal('2.0');
    });
  });
});
