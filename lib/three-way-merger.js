var Merge = require('./merge');
var PackageDescriptor = require('./package-descriptor');
var dependencyKeys = require('./dependency-keys');

var Merger = function Merger(options) {
  this.source = PackageDescriptor.fromJSON(options.source);
  this.ours   = PackageDescriptor.fromJSON(options.ours);
  this.theirs = PackageDescriptor.fromJSON(options.theirs);
};

Merger.merge = function(options) {
  var merger = new Merger(options);

  var result = {};

  dependencyKeys.forEach(function(dependencyKey) {
    var dependenciesMerge = Merge.create({
      source: merger.source[dependencyKey],
      ours: merger.ours[dependencyKey],
      theirs: merger.theirs[dependencyKey]
    });

    result[dependencyKey] = dependenciesMerge;
  });

  return result;
};

module.exports = Merger;
