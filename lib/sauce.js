var fs = require('fs');

var sauce = module.exports = function(args) {
  try {
    var data = fs.readFileSync(process.env.HOME+"/.sauceconf", 'utf8');
  }
  catch(err) {
    console.log("Please create a ~/.sauce file with your creds");
    return;
  }
  var sauceObj = JSON.parse(data);

  this.username = "" || sauceObj.username;
  this.accesskey = "" || sauceObj.accesskey;
}

sauce.prototype.creds = function(cb) {
  return {username: this.username, accesskey: this.accesskey};
}
