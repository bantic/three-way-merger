var DependencySet = require('./dependency-set');
var dependencyKeys = require('./dependency-keys');

function PackageDescriptor() {
  dependencyKeys.forEach(function(dependencyKey) {
    this[dependencyKey] = null;
  });
}

PackageDescriptor.fromJSON = function(json) {
  var descriptor = new PackageDescriptor();

  dependencyKeys.forEach(function(dependencyKey) {
    descriptor[dependencyKey] = DependencySet.fromJSON(json[dependencyKey] || {});
  });

  return descriptor;
};

module.exports = PackageDescriptor;
