var DependencySet = require('./dependency-set');
var Diff = require('./diff');
var DepDiff = require('./dependency-diff');
var Merge = function Merge(add, remove, change) {
  this.add    = add;
  this.remove = remove;
  this.change = change;
};

/**
 * Merge 3 dependency sets
 * @param {Object} options
 * @return {Merge}
 */
Merge.create = function(options) {
  var source = options.source;
  var ours = options.ours;
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
    }
  });
  diff.changed.forEach(function(changedDep) {
    var ourDep = ours.get(changedDep.name);
    if (ourDep && ourDep.version !== changedDep.version) {
      change.push(DepDiff.fromDep(changedDep, {fromVersion: ourDep.version}));
    }
  });

  return new Merge(add, remove, change);
};

module.exports = Merge;
