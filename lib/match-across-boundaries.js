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

      sourceDeps.forEach(function(dep) {
        if (theirDeps.get(dep.name) && !ourDeps.get(dep.name) && otherOurDeps.get(dep.name)) {
          otherSourceDeps.push(sourceDeps.get(dep.name));
          otherTheirDeps.push(theirDeps.get(dep.name));

          sourceDeps.remove(dep.name);
          theirDeps.remove(dep.name);
        }
      });
    });
  });
};
