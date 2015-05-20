var express = require('express');
var path = require('path');
var http = require('http');
var rates = require('./rates');

var publicPath = '/public';
var port = process.env.PORT || 80;
var updateRate = process.env.UPDATE_RATE || 3600 * 1000;
var fullPublicPath = path.join(__dirname, publicPath);

// init server

var app = express();
var server = http.createServer(app);
var router = express.Router();

app.set('port', port);
app.get('/', function(req, res) {
  res.sendFile(path.join(fullPublicPath, '/index.html'));
});
app.use(publicPath, express.static(fullPublicPath));

function die(err) {
  console.error(err.message);
  process.exit(1);
}

function compareLatest(latest, history) {
  if (history[history.length-1].time < latest.time) {
    history.push(latest);
    console.log('updated ' + JSON.stringify(latest));
  }
}

function fetchAndCompare(history) {
  rates.fetchLatest(function(err, latest) {
    if (err) {
      console.error('Unable to fetch latest: ' + err.message);
      return;
    }
    compareLatest(latest, history);
  });
}

// load rates

console.log('Fetching historical rates...');
rates.fetchHistory(function(err, history) {
  if (err) {
    die(err);
    return;
  }

  // data update loop
  fetchAndCompare(history);
  var interval = setInterval(function() {
    fetchAndCompare(history);
  }, updateRate);

  console.log('Starting server...');
  start(history);
});

// start server
//
function start(history) {

  router.get('/history', function(req, res) {
    var data = history;
    var since = new Date(req.query.since);
    if (!isNaN(since)) {
      data = data.filter(function(x) {
        return x.t >= since;
      });
    }
    var until = new Date(req.query.until);
    if (!isNaN(until)) {
      data = data.filter(function(x) {
        return x.t < until;
      });
    }
    res.json(data);
  });
  router.get('/latest', function(req, res) {
    res.json(history[history.length-1]);
  });
  router.get('/predict', function(req, res) {
    var e = history.length-1
    var d = new Date(history[e].t);
    d.setDate(d.getDate()+1);
    res.json({
      t: d,
      x: history[e].x > history[e-1].x ? "up" : "down"
    });
  });
  app.use('/api',router);

  server.listen(port);
  console.log('Listening on port ' + port);
  console.log('Press Ctrl-C to quit');
}
