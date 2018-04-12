var Merge = require('./merge');
var Merger = require('./merger');
var dependencyKeys = require('./dependency-keys');
var matchAcrossBoundaries = require('./match-across-boundaries');

Merger.merge = function(options) {
  var merger = new Merger(options);

  var result = {};

  matchAcrossBoundaries(merger);

  dependencyKeys.forEach(function(dependencyKey) {
    var dependenciesMerge = Merge.create({
      source: merger.source[dependencyKey],
      ours: merger.ours[dependencyKey],
      theirs: merger.theirs[dependencyKey]
    });

    result[dependencyKey] = dependenciesMerge;
  });

  return result;
};

module.exports = Merger;
