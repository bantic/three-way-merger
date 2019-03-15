/* global describe, it */

var expect = require('chai').expect;
var Merger = require('../lib/merger');
var matchAcrossBoundaries = require('../lib/match-across-boundaries');

describe('matchAcrossBoundaries', function() {
  it('devDependencies match dependencies', function() {
    var packages = {
      source: {
        dependencies: {
        },
        devDependencies: {
          a: '1.0',
        }
      },
      ours: {
        dependencies: {
          a: '1.0',
        },
        devDependencies: {
        }
      },
      theirs: {
        dependencies: {
        },
        devDependencies: {
          a: '2.0',
        }
      }
    };

    var merger = new Merger(packages);

    matchAcrossBoundaries(merger);

    expect(merger.source.dependencies.get('a').version).to.equal('1.0');
    expect(merger.ours.dependencies.get('a').version).to.equal('1.0');
    expect(merger.theirs.dependencies.get('a').version).to.equal('2.0');

    expect(merger.source.devDependencies.get('a')).to.be.undefined;
    expect(merger.ours.devDependencies.get('a')).to.be.undefined;
    expect(merger.theirs.devDependencies.get('a')).to.be.undefined;
  });

  it('dependencies match devDependencies', function() {
    var packages = {
      source: {
        dependencies: {
          a: '1.0',
        },
        devDependencies: {
        }
      },
      ours: {
        dependencies: {
        },
        devDependencies: {
          a: '1.0',
        }
      },
      theirs: {
        dependencies: {
          a: '2.0',
        },
        devDependencies: {
        }
      }
    };

    var merger = new Merger(packages);

    matchAcrossBoundaries(merger);

    expect(merger.source.dependencies.get('a')).to.be.undefined;
    expect(merger.ours.dependencies.get('a')).to.be.undefined;
    expect(merger.theirs.dependencies.get('a')).to.be.undefined;

    expect(merger.source.devDependencies.get('a').version).to.equal('1.0');
    expect(merger.ours.devDependencies.get('a').version).to.equal('1.0');
    expect(merger.theirs.devDependencies.get('a').version).to.equal('2.0');
  });

  it('optionalDependencies match dependencies', function() {
    var packages = {
      source: {
        dependencies: {
        },
        optionalDependencies: {
          a: '1.0',
        }
      },
      ours: {
        dependencies: {
          a: '1.0',
        },
        optionalDependencies: {
        }
      },
      theirs: {
        dependencies: {
        },
        optionalDependencies: {
          a: '2.0',
        }
      }
    };

    var merger = new Merger(packages);

    matchAcrossBoundaries(merger);

    expect(merger.source.dependencies.get('a').version).to.equal('1.0');
    expect(merger.ours.dependencies.get('a').version).to.equal('1.0');
    expect(merger.theirs.dependencies.get('a').version).to.equal('2.0');

    expect(merger.source.optionalDependencies.get('a')).to.be.undefined;
    expect(merger.ours.optionalDependencies.get('a')).to.be.undefined;
    expect(merger.theirs.optionalDependencies.get('a')).to.be.undefined;
  });

  it('dependencies match optionalDependencies', function() {
    var packages = {
      source: {
        dependencies: {
          a: '1.0',
        },
        optionalDependencies: {
        }
      },
      ours: {
        dependencies: {
        },
        optionalDependencies: {
          a: '1.0',
        }
      },
      theirs: {
        dependencies: {
          a: '2.0',
        },
        optionalDependencies: {
        }
      }
    };

    var merger = new Merger(packages);

    matchAcrossBoundaries(merger);

    expect(merger.source.dependencies.get('a')).to.be.undefined;
    expect(merger.ours.dependencies.get('a')).to.be.undefined;
    expect(merger.theirs.dependencies.get('a')).to.be.undefined;

    expect(merger.source.optionalDependencies.get('a').version).to.equal('1.0');
    expect(merger.ours.optionalDependencies.get('a').version).to.equal('1.0');
    expect(merger.theirs.optionalDependencies.get('a').version).to.equal('2.0');
  });

  it('doesn\'t match peerDependencies, etc.', function() {
    var packages = {
      source: {
        dependencies: {
        },
        devDependencies: {
          a: '1.0',
        }
      },
      ours: {
        dependencies: {
        },
        devDependencies: {
          a: '1.0',
        },
        peerDependencies: {
          a: '1.0',
        },
      },
      theirs: {
        dependencies: {
        },
        devDependencies: {
          a: '2.0',
        }
      }
    };

    var merger = new Merger(packages);

    matchAcrossBoundaries(merger);

    expect(merger.source.dependencies.get('a')).to.be.undefined;
    expect(merger.ours.dependencies.get('a')).to.be.undefined;
    expect(merger.theirs.dependencies.get('a')).to.be.undefined;

    expect(merger.source.devDependencies.get('a').version).to.equal('1.0');
    expect(merger.ours.devDependencies.get('a').version).to.equal('1.0');
    expect(merger.theirs.devDependencies.get('a').version).to.equal('2.0');

    expect(merger.ours.peerDependencies.get('a').version).to.equal('1.0');
  });

  it('doesn\'t skip any deps', function() {
    var packages = {
      source: {
        dependencies: {
        },
        devDependencies: {
          a: '1.0',
          b: '1.0',
          c: '1.0',
        }
      },
      ours: {
        dependencies: {
          a: '1.0',
          b: '1.0',
          c: '1.0',
        },
        devDependencies: {
        }
      },
      theirs: {
        dependencies: {
        },
        devDependencies: {
          a: '2.0',
          b: '2.0',
          c: '2.0',
        }
      }
    };

    var merger = new Merger(packages);

    matchAcrossBoundaries(merger);

    expect(merger.source.dependencies.get('a').version).to.equal('1.0');
    expect(merger.source.dependencies.get('b').version).to.equal('1.0');
    expect(merger.source.dependencies.get('c').version).to.equal('1.0');

    expect(merger.source.devDependencies.get('a')).to.be.undefined;
    expect(merger.source.devDependencies.get('b')).to.be.undefined;
    expect(merger.source.devDependencies.get('c')).to.be.undefined;
  });
});
