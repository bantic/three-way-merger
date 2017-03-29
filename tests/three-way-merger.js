/* global describe, it */

var expect = require('chai').expect;
var Merger = require('../index');

describe('Three Way Merger', function() {
  describe('basic', function() {
    it('exists', function() {
      expect(Merger).to.be.ok;
    });
  });

  describe('#merge', function() {
    it('returns a merge object for deps and devDeps', function() {
      var packages = {
        source: {
          dependencies: {
            a: '1.0',
            b: '2.0',
            c: '3.0'
          },
          devDependencies: {
            d: '1.0',
            e: '2.0',
            f: '3.0'
          }
        },
        ours: {
          dependencies: {
            a: '1.0',
            b: '2.0',
            c2: '1.0'
          },
          devDependencies: {
            d: '1.0',
            e: '2.5',
            f: '3.0',
            f2: '1.0'
          }
        },
        theirs: {
          dependencies: {
            b: '2.0',
            c: '3.5',
            c3: '1.0'
          },
          devDependencies: {
            d: '1.0',
            e: '2.0',
            f: '3.5'
          }
        }
      };

      var merge = Merger.merge({
        source: packages.source,
        ours: packages.ours,
        theirs: packages.theirs
      });

      expect(merge.dependencies).to.be.ok;
      expect(merge.devDependencies).to.be.ok;

      expect(merge.dependencies.add.length).to.equal(1);
      expect(merge.dependencies.add[0].name).to.equal('c3');
      expect(merge.dependencies.add[0].version).to.equal('1.0');

      expect(merge.dependencies.remove.length).to.equal(1);
      expect(merge.dependencies.remove[0].name).to.equal('a');

      expect(merge.dependencies.change.length).to.equal(0);

      expect(merge.devDependencies.add.length).to.equal(0);
      expect(merge.devDependencies.remove.length).to.equal(0);
      expect(merge.devDependencies.change.length).to.equal(1);
      expect(merge.devDependencies.change[0].name).to.equal('f');
      expect(merge.devDependencies.change[0].version).to.equal('3.5');
    });
  });
});
