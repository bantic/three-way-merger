var DependencyDescriptor = require('./dependency-descriptor');

/**
 * Describes a set of dependencies, such as a package.json's 'devDependencies'
 * Consists of a set of {{DependencyDescriptor}}s
 */
var DependencySet = function DependencySet() {
  this.dependencies = [];
  this.length = 0;
};

DependencySet.fromJSON = function(json) {
  var set = new DependencySet();

  Object.keys(json).forEach(function(key) {
    var dep = DependencyDescriptor.create(key, json[key]);
    set.push(dep);
  });

  return set;
};

DependencySet.prototype.push = function(dependency) {
  this.dependencies.push(dependency);
  this.length++;
};

DependencySet.prototype.get = function(name) {
  for (var i = 0; i < this.dependencies.length; i++) {
    if (this.dependencies[i].name === name) {
      return this.dependencies[i];
    }
  }
};

DependencySet.prototype.remove = function(name) {
  for (var i = 0; i < this.dependencies.length; i++) {
    if (this.dependencies[i].name === name) {
      this.length--;
      return this.dependencies.splice(i, 1)[0];
    }
  }
};

DependencySet.prototype.contains = function(name) {
  return !!this.get(name);
};

DependencySet.prototype.forEach = function(callback) {
  this.dependencies.forEach(callback);
};

DependencySet.prototype.toArray = function() {
  return this.dependencies;
};

module.exports = DependencySet;
