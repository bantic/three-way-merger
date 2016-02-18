/* global describe, it */

var expect = require('chai').expect;
var PackageMerger = require('../index');

describe('Package Merger', function() {
  describe('basic', function() {
    it('exists', function() {
      expect(PackageMerger).to.be.ok;
    });
  });
});
