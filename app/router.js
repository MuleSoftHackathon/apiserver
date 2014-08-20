'use strict';
var http = require('http');
var fs   = require('fs');
var pi   = require('./pi');

exports.rootHandler = function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Welcome to Hackathon!');
};

var remoteDevice = {};
var BTServerKeys;
var BTDeviceMap;

exports.getDevice = function(req, res) {
  res.json(remoteDevice);
};

exports.registerDevice = function(req, res) {
  var device = {
    id: req.body.device_id,
    type: req.body.device_type,
    host: req.ip,
    port: req.body.port
  };

  if (remoteDevice.hasOwnProperty(device.id)) {
    res.status(400).json({message: 'Duplicate device ID detected'});
    return;
  }

  if (device.type === 'bt') {
    if (BTServerKeys.hasOwnProperty(device.id)) {
      device.id = BTServerKeys[device.id];
    } else {
      res.status(400).json({message: 'Invalid id!'});
      return;
    }
  }

  remoteDevice[device.id] = device;
  res.json({message: 'registered!'});
};

exports.removeDevice = function(req, res) {
  var device = remoteDevice[req.body.device_id];

  if (device) {
    if (device.host === req.hostname) {
      delete remoteDevice[req.body.device_id];
      res.json({message: 'Removed!'});
    } else {
      res.status(400).json({message: 'Host does not match'});
    }
  } else {
    res.status(400).json({message: 'No such device'});
  }
};


exports.piHandler = function(req, res) {
  var id   = req.params.id;
  var dest = remoteDevice[id];
	pi.handle(req, res, dest);
};

exports.spheroHandler = function(req, res) {
  _handle(req, res, _redirectBluetooth);
};

exports.rccarHandler = function(req, res) {
	_handle(req, res, _redirectBluetooth);
};

function _handle(req, res, next) {
	var id = req.params.id;
	var team = BTDeviceMap[id];
	if ( !team ) {
		res.json({message: 'no such id'});
	} else {
		next(req, res);
	}
}

function _redirectBluetooth(req, res) {
	var id = req.params.id;
	var team = BTDeviceMap[id];
	var remote = remoteDevice[team];

	if( !remote ) {
		res.status(400).json({message: 'team server not registered!'});
	} else if ( callback ) {
    callback();
  } else {
    console.log('Connection to device: ' + req.host + req.originalUrl);

    var options = {
      hostname: req.host,
      port: remote.port,
      path: req.originalUrl,
      method: 'GET'
    },
    data = '',
    requestToDevice = http.request(options, function (responseFromDevice) {
      responseFromDevice.setEncoding('utf8');
      responseFromDevice.on('data', function (chunk) {
        data += chunk;
      });

      responseFromDevice.on('end', function () {
        res.status(responseFromDevice.statusCode).send(data);
      });
    });

    requestToDevice.on('error', function (e) {
      res.status(400).end();
      console.log('problem with request: ' + e.message);
    });

    requestToDevice.end();
	}
}

fs.readFile('key.config', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var obj = JSON.parse(data);
  BTServerKeys = obj.BTServerKeys;
  BTDeviceMap = obj.BTDeviceMap;
});
