var semver = require('semver');
var DependencySet = require('./dependency-set');
var Diff = require('./diff');
var DepDiff = require('./dependency-diff');
var Merge = function Merge(add, remove, change) {
  this.add    = add.toArray();
  this.remove = remove.toArray();
  this.change = change.toArray();
};

var Range = semver.Range;

function minVersion(range) {
  var r = new Range(range);

  // "" or "*"
  if (!r.range) {
    return '0.0.0';
  }

  return r.set[0][0].semver.version;
}

/**
 * Merge 3 dependency sets
 * @param {Object} options
 * @return {Merge}
 */
Merge.create = function(options) {
  var source = options.source;
  var ours   = options.ours;
  var theirs = options.theirs;

  var add    = new DependencySet();
  var remove = new DependencySet();
  var change = new DependencySet();

  var diff = Diff.create({from: source, to: theirs});
  diff.removed.forEach(function(removedDep) {
    if (ours.contains(removedDep.name)) {
      remove.push(DepDiff.fromDep(removedDep));
    }
  });
  diff.added.forEach(function(addedDep) {
    if (!ours.contains(addedDep.name)) {
      add.push(DepDiff.fromDep(addedDep));
    } else {
      var ourDep = ours.get(addedDep.name);
      if (ourDep && ourDep.version !== addedDep.version &&
          semver.lt(minVersion(ourDep.version), minVersion(addedDep.version))) {
        change.push(DepDiff.fromDep(addedDep, {fromVersion: ourDep.version}));
      }
    }
  });
  diff.changed.forEach(function(changedDep) {
    var ourDep = ours.get(changedDep.name);
    if (ourDep && ourDep.version !== changedDep.version &&
        semver.lt(minVersion(ourDep.version), minVersion(changedDep.version))) {
      change.push(DepDiff.fromDep(changedDep, {fromVersion: ourDep.version}));
    }
  });

  return new Merge(add, remove, change);
};

module.exports = Merge;
