# three-way-merger

[![npm version](https://badge.fury.io/js/three-way-merger.svg)](https://badge.fury.io/js/three-way-merger)
[![Build Status](https://travis-ci.org/bantic/three-way-merger.svg?branch=master)](https://travis-ci.org/bantic/three-way-merger)

Used to figure out the minimum changes needed to be made to create a 3-way merge of dependencies (for an app's `devDependencies` or `dependencies`, e.g.).

## usage

```javascript
var Merger = require('three-way-merger');

// e.g., the blueprinted package.json from the version of ember-cli we are upgrading *from*:
var source = {
  devDependencies: {
    a: '1.0',
    b: '2.0',
    e: '1.0',
    f: '1.0'
  }
};

var ours = {
  devDependencies: {
    a: '1.0',
    // b: '2.0', // user removed dep on 'b'
    c: '3.0', // and added dep on 'c'
    e: '1.0',
    f: '2.0'  // user updated independently to latest
  }
};

// e.g., the blueprinted package.json from the version of ember-cli we are upgrading *to*:
var theirs = {
  devDependencies: {
    a: '1.5', // a was bumped
    b: '2.5', // b was bumped
    d: '1.0', // ember-cli introduced new dep on d
    // e: '1.0', // e was removed
    f: '1.5'  // f was bumped, but `ours` is newer so ignore
  }
};

var result = Merger.merge({source: source, ours: ours, theirs: theirs});

console.log(result.devDependencies.add);
// [{name: 'd', version: '1.0'}]  // need to add dep on d@1.0
// dep 'b' is not listed as requiring addition because user explicitly removed it from `ours` devDependencies

console.log(result.devDependencies.remove);
// [{name: 'e', version: '1.0'}]  // need to remove dep on e@1.0

console.log(result.devDependencies.change);
// [{name: 'a', version: '1.5', fromVersion: '1.0'}]  // need to update a@1.0 to a@1.5
// dep 'f' is not listed as requiring change because user explicitly updated it past `theirs` version

```

## to do

 * documentation
 * create ember addon to consume this output
