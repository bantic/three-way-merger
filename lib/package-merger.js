var PackageDescriptor = require('./package-descriptor');
var PackageManager = function PackageManager() {};

PackageManager.prototype.merge = function(options) {
  this.source  = PackageDescriptor.fromJSON(options.source);
  this.ours    = PackageDescriptor.fromJSON(options.current);
  this.theirs  = PackageDescriptor.fromJSON(options.theirs);
};

module.exports = PackageManager;
