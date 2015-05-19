var request = require('request');
var xml2js = require('xml2js');

var history = 'http://www.ecb.europa.eu/stats/exchange/eurofxref/html/usd.xml';
var latest = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

function fetchXML(url, callback) {
  request(url, function(err, res, body) {
    if (err || res.statusCode != 200) {
      callback(new Error('Couldn\'t fetch ' + url));
      return;
    }
    xml2js.parseString(body, function(err, res) {
      if (err) {
        callback(new Error('Invalid xml'));
        return;
      }
      callback(null, res);
    });
  });
}

// Fetch historical rates

exports.fetchHistory = function(callback) {
  fetchXML(history, function(err, res) {
    if (err) {
      callback(err);
      return;
    }
    var r;
    try {
      r = res.CompactData.DataSet[0].Series[0].Obs.map(function(x) {
        return {
          t: new Date(x.$.TIME_PERIOD),
          x: parseFloat(x.$.OBS_VALUE)
        };
      });
    } catch (ex) {
      callback(new Error('Couldn\'t parse history'));
      return;
    }
    callback(null, r);
  });
}

// Fetch latest rate

exports.fetchLatest = function(callback) {
  fetchXML(latest, function(err, res) {
    if (err) {
      callback(err);
      return;
    }
    var r;
    try {
      var c = res['gesmes:Envelope'].Cube[0].Cube[0]
      var x = c.Cube.filter(function(x) {
        return x.$.currency === 'USD';
      })[0].$.rate;
      r = {
        t: new Date(c.$.time),
        x: parseFloat(x)
      };
    } catch (ex) {
      callback(new Error('Couldn\'t parse latest'));
      return;
    }
    callback(null, r);
  });
}
