'use strict';

var mutuallyExclusiveDependencyKeys = {
  dependencies: [
    'devDependencies',
    'optionalDependencies'
  ],
  devDependencies: [
    'dependencies'
  ],
  optionalDependencies: [
    'dependencies'
  ]
};

// user has dependency dep@1
// remote updated devDependency dep@1 -> dep@2
// result: dependency is updated dep@1 -> dep@2
module.exports = function matchAcrossBoundaries(merger) {
  Object.keys(mutuallyExclusiveDependencyKeys).forEach(function(dependencyKey) {
    var sourceDeps = merger.source[dependencyKey];
    var ourDeps = merger.ours[dependencyKey];
    var theirDeps = merger.theirs[dependencyKey];

    var otherDependencyKeys = mutuallyExclusiveDependencyKeys[dependencyKey];
    otherDependencyKeys.forEach(function(otherDependencyKey) {
      var otherSourceDeps = merger.source[otherDependencyKey];
      var otherOurDeps = merger.ours[otherDependencyKey];
      var otherTheirDeps = merger.theirs[otherDependencyKey];

      // since we are removing from sourceDeps,
      // create a clone first
      sourceDeps.toArray().slice().forEach(function(dep) {
        if (!otherOurDeps.get(dep.name)) {
          return;
        }
        
        otherSourceDeps.push(dep);
        sourceDeps.remove(dep.name);

        if (!theirDeps.get(dep.name)) {
          return;
        }

        otherTheirDeps.push(theirDeps.get(dep.name));
        theirDeps.remove(dep.name);
      });
    });
  });
};
