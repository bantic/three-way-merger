/* global describe, it */

var expect = require('chai').expect;
var PackageDescriptor = require('../lib/package-descriptor');

describe('Package Descriptor', function() {
  it('exists', function() {
    expect(PackageDescriptor).to.be.ok;
  });

  var json = {
    name: '...',
    dependencies: {
      'chai': '^1.2.3'
    },
    devDependencies: {
      'mocha': '2.3.0',
      'should': '1.0'
    },
    peerDependencies: {
      'bar': '1.2.3'
    },
    optionalDependencies: {
      'foo': '1.2.3'
    }
  };

  describe('#fromJSON', function() {
    it('gets the correct number of deps', function() {
      var descriptor = PackageDescriptor.fromJSON(json);

      expect(descriptor.dependencies.length).to.equal(1);
      expect(descriptor.devDependencies.length).to.equal(2);
      expect(descriptor.peerDependencies.length).to.equal(1);
      expect(descriptor.optionalDependencies.length).to.equal(1);
    });

    it('works without dependencies', function() {
      var jsonWithoutDeps = {
        name: '...',
        devDependencies: {
          'mocha': '2.3.0',
          'should': '1.0'
        }
      };
      var descriptor = PackageDescriptor.fromJSON(jsonWithoutDeps);
      expect(descriptor.dependencies.length).to.equal(0);
      expect(descriptor.devDependencies.length).to.equal(2);
    });

    it('works without devDependencies', function() {
      var jsonWithoutDevDeps = {
        name: '...',
        dependencies: {
          'mocha': '2.3.0',
          'should': '1.0'
        }
      };
      var descriptor = PackageDescriptor.fromJSON(jsonWithoutDevDeps);
      expect(descriptor.dependencies.length).to.equal(2);
      expect(descriptor.devDependencies.length).to.equal(0);
    });
  });
});
