'use strict';

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
  let retVal = {
    isInvalid: false
  };

  let r;

  try {
    r = new Range(range);

    // "" or "*"
    if (!r.range) {
      return '0.0.0';
    }
  
    retVal.version = r.set[0][0].semver.version;
  } catch (err) {
    // handle github:foo/a#bar
    if (!err.message.startsWith('Invalid comparator')) {
      throw err;
    }
    retVal.isInvalid = true;
  }

  return retVal;
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
      if (ourDep && ourDep.version !== addedDep.version) {
        let ours = minVersion(ourDep.version);
        if (ours.isInvalid) {
          // ours is github:foo/a#bar
          // treat this as truth and never change
          return;
        }
        let added = minVersion(addedDep.version);
        let forceChange;
        if (added.isInvalid) {
          // theirs is github:foo/a#bar and ours isn't
          // treat theirs as truth and change
          forceChange = true;
        }
        if (forceChange || semver.lt(ours.version, added.version)) {
          change.push(DepDiff.fromDep(addedDep, {fromVersion: ourDep.version}));
        }
      }
    }
  });
  diff.changed.forEach(function(changedDep) {
    var ourDep = ours.get(changedDep.name);
    if (ourDep && ourDep.version !== changedDep.version) {
      let ours = minVersion(ourDep.version);
      if (ours.isInvalid) {
        // ours is github:foo/a#bar
        // treat this as truth and never change
        return;
      }
      let changed = minVersion(changedDep.version);
      let forceChange;
      if (changed.isInvalid) {
        // theirs is github:foo/a#bar and ours isn't
        // treat theirs as truth and change
        forceChange = true;
      }
      if (forceChange || semver.lt(ours.version, changed.version)) {
        change.push(DepDiff.fromDep(changedDep, {fromVersion: ourDep.version}));
      }
    }
  });

  return new Merge(add, remove, change);
};

module.exports = Merge;
