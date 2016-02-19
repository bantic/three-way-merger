/**
 * Describes a dependency with `name` and `version` properties
 */
var DependencyDescriptor = function DependencyDescriptor(name, version) {
  this.name = name;
  this.version = version;
};

DependencyDescriptor.create = function(name, version) {
  return new DependencyDescriptor(name, version);
};

module.exports = DependencyDescriptor;
