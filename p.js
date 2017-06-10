var webshot = require('webshot');
var fs      = require('fs');

var renderStream = webshot('google.com');
var file = fs.createWriteStream('./sss\google.png', {encoding: 'binary'});

renderStream.on('data', function(data) {
  file.write(data.toString('binary'), 'binary');
});
