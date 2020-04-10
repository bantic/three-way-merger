var Range = require('semver').Range;

// matches "^1" or "1" but not "^1 || ^3" or ">2" or "foo/bar"
function isSimpleVersionOrRange(rangeString) {
  var range;
  try {
    range = new Range(rangeString);
  } catch (err) {
    // probably a URL
    return false;
  }
  var isSimpleRange = range.set.length === 1;
  return isSimpleRange && typeof getHint(rangeString) === 'string';
}

function getHint(rangeString) {
  var matches = rangeString.match(/^ *[\^~]? *(?=\d)/);
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

    if (dependency.fromVersion && isSimpleVersionOrRange(options.fromVersion)) {
      let bothWithSameHint = isSimpleVersionOrRange(dependency.fromVersion) && isSimpleVersionOrRange(dependency.version)
        && getHint(dependency.fromVersion).trim() === getHint(dependency.version).trim();
      if (bothWithSameHint) {
        let ourHint = getHint(options.fromVersion);
        this.version = dependency.version.replace(/^ *[\^~]? *(?=\d)/, ourHint);
      }
    }
  }
};

DependencyDiff.fromDep = function(dependency, options) {
  return new DependencyDiff(dependency, options);
};

module.exports = DependencyDiff;
