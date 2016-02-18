/* global describe, it */

var expect = require('chai').expect;
var Diff = require('../lib/diff');
var DependencySet = require('../lib/dependency-set');
function createDiff(json) {
  var source = DependencySet.fromJSON(json.source);
  var ours = DependencySet.fromJSON(json.ours);
  var theirs = DependencySet.fromJSON(json.theirs);

  return Diff.create({
    source: source,
    ours: ours,
    theirs: theirs
  });
}

describe('Diff', function() {
  it('exists', function() {
    expect(Diff).to.be.ok;
  });

  describe('equivalent source, ours, theirs', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      theirs: {
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

  describe('only added to ours', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.0',
        'other': '1.1'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': '1.0'
      }
    };

    it('includes the added deps', function() {
      var diff = createDiff(json);
      expect(diff.removed.length).to.equal(0);
      expect(diff.changed.length).to.equal(0);

      expect(diff.added.length).to.equal(1);
    });
  });
});
