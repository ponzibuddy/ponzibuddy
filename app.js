var express = require('express');
var path = require('path');
var http = require('http');

var history = 'http://www.ecb.europa.eu/stats/exchange/eurofxref/html/usd.xml';
var daily = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

var public_path = '/public';
var port = process.env.PORT || 80;
var full_public_path = path.join(__dirname, public_path);

// start server

var app = express();
var server = http.createServer(app);

app.set('port', port);
app.get('/', function(req, res) {
  res.sendFile(path.join(full_public_path, '/index.html'));
});
app.use(public_path, express.static(full_public_path));

server.listen(port);
console.log('Listening on port ' + port);
console.log('Press Ctrl-C to quit');
