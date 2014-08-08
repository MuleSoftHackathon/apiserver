'use strict';
var request = require('request');

exports.handle = function (req, res, dest) {
  var action = req.params.action;

  if (dest === undefined) {
    res.status(400).json({message: 'Device not registered.'});
  } else {
    var url = 'http://' + dest.host + ':' + dest.port + '/' + action;

    var options = {
      url: url,
      method: req.method,
      headers: { host: dest.host + ':' + dest.port },
      json: req.body
    };

    console.log('Forwarding Pi request to %s:%d', dest.host, dest.port);
    console.log('%s %s', req.method, url);

    request(options,
      function (error, response, body) {
        if (!error) {
          res.status(response.statusCode).json(body);
        } else {
          console.log('Error occured %s', response.statusCode);
          res.status(response.statusCode).json({message: 'Error occured'});
        }
      }
    );
  }
};
