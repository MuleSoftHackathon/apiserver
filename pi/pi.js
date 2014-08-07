'use strict';
var http = require('http');

exports.handle = function (req, res, dest) {
  var id = req.params.id;
  var action = req.params.action;

  if (dest === undefined) {
    res.status(400).json({message: 'Device not registered.'});
  } else {
    var url = 'http://' + dest.host + ':' + dest.port + '/' + action;

    var data = '';
    var options = {
      hostname: dest.host,
      port: dest.port,
      path: '/' + action
    };

    var request = http.request(options, function(response) {
      console.log('STATUS: ' + response.statusCode);
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        data += chunk;
      });

      response.on('end', function (chunk) {
        res.json(JSON.parse(data));
      });
    });

    request.on('error', function(e) {
      console.log('Got error: ' + e.message);
      res.status(500).json({message: e.message});
    });

    request.end();
  }
};
