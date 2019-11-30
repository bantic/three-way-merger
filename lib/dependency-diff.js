var Range = require('semver').Range;

// matches "^1.0.0" but not "^1.0.0 || ^3.0.0" or "1.0"
function hasSimpleHint(rangeString) {
  var range = new Range(rangeString);
  var isSimpleRange = range.set.length === 1 && range.set[0].length === 2;
  return isSimpleRange && !!getHint(rangeString);
}

// matches "1.0.0" and "1.0" but not "^1.0.0"
function hasNoHint(rangeString) {
  var range = new Range(rangeString);
  var isPinned = range.set.length === 1 && range.set[0].length === 1;
  return isPinned || !getHint(rangeString);
}

function getHint(rangeString) {
  var matches = rangeString.match(/^ *[\^~]/);
  return matches && matches[0];
}

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

    if (dependency.fromVersion && hasSimpleHint(options.fromVersion)) {
      let ourHint = getHint(options.fromVersion);
      if (hasNoHint(dependency.fromVersion) && hasNoHint(dependency.version)) {
        this.version = `${ourHint}${dependency.version}`;
      }
      if (hasSimpleHint(dependency.fromVersion) && hasSimpleHint(dependency.version)
        && getHint(dependency.fromVersion) === getHint(dependency.version)) {
        this.version = dependency.version.replace(/[\^~]/, ourHint);
      }
    }
  }
};

DependencyDiff.fromDep = function(dependency, options) {
  return new DependencyDiff(dependency, options);
};

module.exports = DependencyDiff;
