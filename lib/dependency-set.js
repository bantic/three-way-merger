var DependencyDescriptor = require('./dependency-descriptor');

var DependencySet = function DependencySet() {};

DependencySet.fromJSON = function(json) {
  var set = new DependencySet();

  set.dependencies = [];
  Object.keys(json).forEach(function(key) {
    set.dependencies.push(DependencyDescriptor.create(key, json[key]));
  });

  set.length = set.dependencies.length;

  return set;
};

DependencySet.prototype.contains = function(name) {
  for (var i = 0; i < this.dependencies.length; i++) {
    if (this.dependencies[i].name === name) {
      return true;
    }
  }

  return false;
};

DependencySet.prototype.forEach = function(callback) {
  this.dependencies.forEach(callback);
};

module.exports = DependencySet;
