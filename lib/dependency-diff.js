/**
 * A dependency "diff".
 * Has `name` and `version` properties just like a Dependency,
 * and an optional `fromVersion` property that is the previous version
 * value for this dependency (if the dependency was changed and not added
 * or removed).
 */
var DependencyDiff = function DependencyDiff(dependency, options) {
  this.name = dependency.name;
  this.version = dependency.version;

  if (options && options.fromVersion) {
    this.fromVersion = options.fromVersion;
  }
};

DependencyDiff.fromDep = function(dependency, options) {
  return new DependencyDiff(dependency, options);
};

module.exports = DependencyDiff;
