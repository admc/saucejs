# sauce 

## Update node to latest

http://nodejs.org/#download

## Install

<pre>
npm install sauce
</pre>

## Authors

  - Adam Christian ([admc](http://github.com/admc))
  
## License

  * License - Apache 2: http://www.apache.org/licenses/LICENSE-2.0

## Usage

<pre>
var sauce = require('sauce');
console.log(sauce.sauce().creds());
</pre>

## CLI

<pre>
  > sauce --browser iexplore --version 9 --cli
  > sauce --creds
  > sauce --browser iphone --version 5 --os MAC
</pre>


