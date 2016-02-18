var DependencySet = require('./dependency-set');

function PackageDescriptor() {
  this.dependencies = null;
  this.devDependencies = null;
}

PackageDescriptor.fromJSON = function(json) {
  var descriptor = new PackageDescriptor();

  descriptor.dependencies    = DependencySet.fromJSON(json.dependencies);
  descriptor.devDependencies = DependencySet.fromJSON(json.devDependencies);

  return descriptor;
};

module.exports = PackageDescriptor;
