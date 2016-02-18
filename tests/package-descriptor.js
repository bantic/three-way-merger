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
    }
  };

  describe('#fromJSON', function() {
    it('gets the correct number of dependencies and devDependencies', function() {
      var descriptor = PackageDescriptor.fromJSON(json);

      expect(descriptor.dependencies.length).to.equal(1);
      expect(descriptor.devDependencies.length).to.equal(2);
    });
  });
});
