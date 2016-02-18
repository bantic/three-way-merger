var DependencyDescriptor = function DependencyDescriptor() {};
DependencyDescriptor.create = function(name, version) {
  var descriptor = new DependencyDescriptor();
  descriptor.name = name;
  descriptor.version = version;

  return descriptor;
};

module.exports = DependencyDescriptor;
