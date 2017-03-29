var Merge = require('./merge');
var PackageDescriptor = require('./package-descriptor');
var Merger = function Merger(options) {
  this.source  = PackageDescriptor.fromJSON(options.source);
  this.ours    = PackageDescriptor.fromJSON(options.ours);
  this.theirs  = PackageDescriptor.fromJSON(options.theirs);
};

Merger.merge = function(options) {
  var merger = new Merger(options);

  var dependenciesMerge = Merge.create({
    source: merger.source.dependencies,
    ours: merger.ours.dependencies,
    theirs: merger.theirs.dependencies
  });
  var devDependenciesMerge = Merge.create({
    source: merger.source.devDependencies,
    ours: merger.ours.devDependencies,
    theirs: merger.theirs.devDependencies
  });

  return {
    dependencies: dependenciesMerge,
    devDependencies: devDependenciesMerge
  };
};

module.exports = Merger;
