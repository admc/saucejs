var fs = require('fs')
  , request = require('request')

var sauce = module.exports = function(args) {
  if (!process.env.SAUCE_USERNAME) {
    try {
      var data = fs.readFileSync(process.env.HOME+"/.sauceconf", 'utf8');
      var sauceObj = JSON.parse(data);
      this.username =  sauceObj.username;
      this.accessKey = sauceObj.accessKey;
    }
    catch(err) {
      throw new Error("Please put your creds in process.env.SAUCE_USERNAME, SAUCE_ACCESS_KEY, or create a ~/.sauceconf file with your creds.");
    }
  }
  else {
    this.username = "" || process.env.SAUCE_USERNAME
    this.accessKey = "" || process.env.SAUCE_ACCESS_KEY
  }

}

sauce.prototype.creds = function(cb) {
  return {username: this.username, accessKey: this.accessKey};
}

sauce.prototype.go = function(argv, cb) {
  var _this = this;
  request.get({url:"http://saucelabs.com/rest/v1/info/scout", json:true}, function (e, r, browsers) {
    _this.browsers = browsers;
    
    // if we don't have an OS provided, find one
    if (!argv.os) {
      argv.version = "10";
      var more = true;
      var x = 0;
      while ((x > _this.browsers.length)
        && (more == true)) {
        var bObj = _this.browsers[x];
        console.log(bObj);
        console.log(argv);
        if ((bObj.name == argv.browser) &&
            (bObj.version == argv.short_version)) {
          argv.os = _this.browsers[x].os;
          more = false;
        }
        x++;
      }
    }

    var options = {
      uri: 'https://'+_this.username+':'+_this.accessKey+'@saucelabs.com/rest/v1/users/'+_this.username+'/scout',
      method: 'POST',
      json: {"os":argv.os || "Windows 2003"
              , "browser":argv.browser || "firefox"
              , "browser-version":argv.version || "10"
              , "url":argv.url || "http://hello-internet.org"}
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        cb(body.embed);
      }
    });
  })
}
