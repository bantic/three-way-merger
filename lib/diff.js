// Diff dependency sets
var Diff = function Diff(options) {
  this.added   = options.added;
  this.removed = options.removed;
  this.changed = options.changed;
};

Diff.create = function(options) {
  var source = options.source;
  var ours = options.ours;
  var theirs = options.theirs;

  var added   = [];
  var removed = [];
  var changed = [];

  ours.forEach(function(dep) {
    if (!source.contains(dep.name)) {
      added.push(dep);
    }
  });

  return new Diff({
    added: added,
    removed: removed,
    changed: changed
  });
};

module.exports = Diff;
