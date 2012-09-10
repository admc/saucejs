#!/usr/bin/env node

var argv = require('optimist').argv;

if (argv.creds) {
  var sauce = require('sauce');
  console.log(sauce.sauce().creds());
}
else {
  console.log("What shall we do? try..");
  console.log("--creds");
}
