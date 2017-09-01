# three-way-merger

[![npm version](https://badge.fury.io/js/three-way-merger.svg)](https://badge.fury.io/js/ember-cli-update)
[![Build Status](https://travis-ci.org/bantic/three-way-merger.svg?branch=master)](https://travis-ci.org/bantic/three-way-merger)

Used to figure out the minimum changes needed to be made to create a 3-way merge of dependencies (for an app's `devDependencies` or `dependencies`, e.g.).

## usage

```javascript
var Merger = require('three-way-merger');

// e.g., the blueprinted package.json from the version of ember-cli eare upgrading *from*:
var source = {
  devDependencies: {
    a: '1.0',
    b: '2.0'
  }
};

var ours = {
  devDependencies: {
    a: '1.0',
    // b: '2.0' // user removed dep on 'b'
    c: '3.0', // and added dep on 'c'
  }
};

// e.g., the blueprinted package.json from the version of ember-cli we are upgrading *to*:
var theirs = {
  devDependencies: {
    a: '1.5', // a was bumped
    b: '2.5', // b was bumped
    d: '1.0'  // ember-cli introduced new dep on d
  }
};

var result = Merger.merge({source: source, ours: ours, theirs: theirs});

console.log(result.devDependencies.add);
// [{name: 'd', version: '1.0'}]  // need to add dep on d@1.0
// dep 'b' is not listed as requiring addition because user explicitly removed it from `ours` devDependencies

console.log(result.devDependencies.remove);
// []  // no deps to remove

console.log(result.devDependencies.change);
// [{name: 'a', version: '1.5', fromVersion: '1.0'}]  // need to update a@1.0 to a@1.5

```

## to do

 * use semver to determine whether change is upgrade or downgrade
 * documentation
 * create ember addon to consume this output
