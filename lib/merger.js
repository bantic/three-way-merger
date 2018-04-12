'use strict';

var PackageDescriptor = require('./package-descriptor');

module.exports = function Merger(options) {
  this.source = PackageDescriptor.fromJSON(options.source);
  this.ours   = PackageDescriptor.fromJSON(options.ours);
  this.theirs = PackageDescriptor.fromJSON(options.theirs);
};
