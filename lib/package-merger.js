var Merge = require('./merge');
var PackageDescriptor = require('./package-descriptor');
var PackageMerger = function PackageMerger(options) {
  this.source  = PackageDescriptor.fromJSON(options.source);
  this.ours    = PackageDescriptor.fromJSON(options.ours);
  this.theirs  = PackageDescriptor.fromJSON(options.theirs);
};

PackageMerger.merge = function(options) {
  var merger = new PackageMerger(options);

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

module.exports = PackageMerger;
