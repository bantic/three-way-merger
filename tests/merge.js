/* global describe, it */

var expect = require('chai').expect;
var Merge = require('../lib/merge');
var DependencySet = require('../lib/dependency-set');

function createMerge(json) {
  var source = DependencySet.fromJSON(json.source);
  var ours   = DependencySet.fromJSON(json.ours);
  var theirs = DependencySet.fromJSON(json.theirs);

  return Merge.create({
    source: source,
    ours: ours,
    theirs: theirs
  });
}

describe('Merge', function() {
  it('exists', function() {
    expect(Merge).to.be.ok;
  });

  describe('equivalent ours,source,theirs', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': '1.0'
      }
    };

    it('has no adds, removes or changes', function() {
      var merge = createMerge(json);

      expect(merge.add.length).to.equal(0);
      expect(merge.remove.length).to.equal(0);
      expect(merge.change.length).to.equal(0);
    });
  });

  describe('added to theirs', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': '1.0',
        'other': '1.1'
      }
    };

    it('includes the added deps', function() {
      var merge = createMerge(json);
      expect(merge.remove.length).to.equal(0);
      expect(merge.change.length).to.equal(0);

      expect(merge.add.length).to.equal(1);
      var dep = merge.add[0];
      expect(dep.name).to.equal('other');
      expect(dep.version).to.equal('1.1');
    });
  });

  describe('added to ours is ignored', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.0',
        'other': '1.1'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': '1.0'
      }
    };

    it('includes no added deps', function() {
      var merge = createMerge(json);
      expect(merge.remove.length).to.equal(0);
      expect(merge.change.length).to.equal(0);
      expect(merge.add.length).to.equal(0);
    });
  });

  describe('removed from theirs but in ours', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.0',
        'other': '1.1'
      },
      theirs: {
        'mocha': '2.3.0'
      }
    };

    it('marked for removal', function() {
      var merge = createMerge(json);
      expect(merge.change.length).to.equal(0);
      expect(merge.add.length).to.equal(0);

      expect(merge.remove.length).to.equal(1);
      var dep = merge.remove[0];
      expect(dep.name).to.equal('should');
      expect(dep.version).to.equal('1.0');
    });
  });

  describe('removed from ours and theirs', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'other': '1.1'
      },
      theirs: {
        'mocha': '2.3.0'
      }
    };

    it('not marked for removal', function() {
      var merge = createMerge(json);
      expect(merge.change.length).to.equal(0);
      expect(merge.add.length).to.equal(0);
      expect(merge.remove.length).to.equal(0);
    });
  });

  describe('present in ours, upgraded in theirs', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': '1.1'
      }
    };

    it('marked for change', function() {
      var merge = createMerge(json);

      expect(merge.remove.length).to.equal(0);
      expect(merge.add.length).to.equal(0);
      expect(merge.change.length).to.equal(1);

      var dep = merge.change[0];
      expect(dep.version).to.equal('1.1');
      expect(dep.fromVersion).to.equal('1.0');
    });
  });

  describe('ours uses git fork, use ours', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': 'github:foo/a#bar'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': '1.1'
      }
    };

    it('not marked for change', function() {
      var merge = createMerge(json);
      expect(merge.change.length).to.equal(0);
      expect(merge.add.length).to.equal(0);
      expect(merge.remove.length).to.equal(0);
    });
  });

  describe('theirs uses git fork, use theirs', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': 'github:foo/a#bar'
      }
    };

    it('marked for change', function() {
      var merge = createMerge(json);

      expect(merge.remove.length).to.equal(0);
      expect(merge.add.length).to.equal(0);
      expect(merge.change.length).to.equal(1);

      var dep = merge.change[0];
      expect(dep.version).to.equal('github:foo/a#bar');
      expect(dep.fromVersion).to.equal('1.0');
    });
  });

  describe('upgraded in theirs, ours is higher', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.2'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': '1.1'
      }
    };

    it('not marked for change', function() {
      var merge = createMerge(json);

      expect(merge.remove.length).to.equal(0);
      expect(merge.add.length).to.equal(0);
      expect(merge.change.length).to.equal(0);
    });
  });

  describe('not present in source, present in ours and, upgraded in theirs', function() {
    var json = {
      source: {
      },
      ours: {
        'foo-package': '1.1.1',
      },
      theirs: {
        'foo-package': '2.2.2',
      }
    };

    it('marked for change', function() {
      var merge = createMerge(json);

      expect(merge.remove.length).to.equal(0);
      expect(merge.add.length).to.equal(0);
      expect(merge.change.length).to.equal(1);

      var dep = merge.change[0];
      expect(dep.version).to.equal('2.2.2');
      expect(dep.fromVersion).to.equal('1.1.1');
    });
  });

  describe('present in ours, downgraded in theirs', function() {
    var json = {
      source: {
        'mocha': '2.3.0',
        'should': '1.0'
      },
      ours: {
        'mocha': '2.3.0',
        'should': '1.1'
      },
      theirs: {
        'mocha': '2.3.0',
        'should': '0.9'
      }
    };

    it('not marked for change', function() {
      var merge = createMerge(json);

      expect(merge.remove.length).to.equal(0);
      expect(merge.add.length).to.equal(0);
      expect(merge.change.length).to.equal(0);
    });
  });
});
