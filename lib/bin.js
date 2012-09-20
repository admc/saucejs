#!/usr/bin/env node

var argv = require('optimist').argv
  , sauce = require('sauce')
  , colors = require('colors');

if (argv.creds) {
  console.log(sauce.sauce().creds());
}
else if (argv.browser) {
  console.log('Getting you a browser...'.green.bold);
  sauce.sauce().go(argv, function(url) {
    console.log("");
    console.log("In a browser, goto: ".cyan);
    console.log("   "+url);
  });
}
else {
  console.log("Welcome to the Sauce Labs CLI, what shall we do? try..".green.bold);
  console.log("   --creds".yellow);
  console.log("   --browser".yellow);
}
