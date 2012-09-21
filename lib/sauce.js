var fs = require('fs')
  , request = require('request')
  , repl = require('repl')
  , webdriver = require('wd');

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
      var more = true;
      var x = 0;
      while ((x > _this.browsers.length)
        && (more == true)) {
        var bObj = _this.browsers[x];
        if (bObj.name == argv.browser) {
          if (argv.version) {
            if (bObj.version == argv.short_version) {
              argv.os = _this.browsers[x].os;
              more = false;
            }
          }
          else {
            argv.os = _this.browsers[x].os;
            more = false;
          }
        }
        x++;
      }
    }

    if (argv.cli) {
        var browser = webdriver.remote("ondemand.saucelabs.com"
                                        , 80
                                        , _this.username
                                        , _this.accessKey);

        browser.on('status', function(info){
          console.log('\x1b[36m%s\x1b[0m', info);
        });
        /*browser.on('command', function(meth, path){
          console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
        });*/

        desired = {
          browserName: argv.browser || "firefox"
          , version: argv.version || ""
          , platform: argv.os || ""
          , tags: ["CLI"]
          , name: "Sauce CLI browser session"
        }

        browser.init( desired, function() {
          browser.get(argv.url || "http://hello-internet.org", function() {
            var r = repl.start({prompt: '( '+argv.browser+' ): '
                                , ignoreUndefined: true
                                , useColors: true
                                , eval: function(cmd, context, filename, callback) {
                                  if (cmd.length > 3) {
                                    browser.safeEval(cmd, function(err, out) {
                                      if (err) { console.log(err.red + "\n"); }
                                      if (out) { console.log(out.green + "\n"); }
                                      callback();
                                    });
                                  }
                                }
                              });
            r.on('exit', function () {
              browser.quit();
            });
            r.context.browser = browser;
          });
        });
    }
    else {
      var options = {
        uri: 'https://'+_this.username+':'+_this.accessKey+'@saucelabs.com/rest/v1/users/'+_this.username+'/scout',
        method: 'POST',
        json: {"os": argv.os || ""
                , "browser": argv.browser || "firefox"
                , "browser-version": argv.version || ""
                , "url": argv.url || "http://hello-internet.org"}
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          cb(body.embed);
        }
      });
    }

  })
}
