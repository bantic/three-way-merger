// Diff dependency sets
var DependencySet = require('./dependency-set');
var DepDiff = require('./dependency-diff');

/**
 * An object described what changed between the `from` and `to`
 * {{DependencySet}}s.
 * Has `added`, `removed` and `changed` properties, each of which are
 * themselves a {{DependencySet}}.
 */
var Diff = function Diff(options) {
  this.added   = options.added;
  this.removed = options.removed;
  this.changed = options.changed;
};

Diff.create = function(options) {
  var from = options.from;
  var to = options.to;

  var added   = new DependencySet();
  var removed = new DependencySet();
  var changed = new DependencySet();

  to.forEach(function(dep) {
    var fromDep = from.get(dep.name);
    if (!fromDep) {
      added.push(dep);
    } else if (dep.version !== fromDep.version) {
      var depDiff = DepDiff.fromDep(dep, {fromVersion: fromDep.version});
      changed.push(depDiff);
    }
  });

  from.forEach(function(dep) {
    if (!to.contains(dep.name)) {
      removed.push(dep);
    }
  });

  return new Diff({
    added: added,
    removed: removed,
    changed: changed
  });
};

module.exports = Diff;
