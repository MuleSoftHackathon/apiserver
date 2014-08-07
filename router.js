'use strict';

var http = require('http');
var fs   = require('fs');
var pi   = require('./pi/pi');

exports.rootHandler = function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Welcome to Hackathon!');
};

var bluetoothServerPort = 8352;
var bluetoothServers = {};
var deviceIPMappings = {};
var BTServerKeys;
var BTDeviceMap;

exports.register = function(req, res) {
	var id   = req.body.device_id;
  var type = req.body.device_type;
  var port = req.body.port;
	var host = req.hostname;

  if (type === 'pi') {
    deviceIPMappings[id] = {
      host: host,
      port: port
    };
    res.json({message: 'registered!'});
  } else if (type === 'bt') {
    var team = BTServerKeys[id];
    if (!team) {
      res.status(400).json({message: 'invalid id!'});
    } else {
      bluetoothServers[team] = host;
      res.json({message: 'registered!'});
    }
  } else {
    res.status(400).json({message: 'Unknown device type.'});
  }
};

exports.piHandler = function(req, res) {
  var id   = req.params.id;
  var dest = deviceIPMappings[id];
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
	var host = bluetoothServers[team];

	if( !host ) {
		res.status(400).json({message: 'team server not registered!'});
	} else if ( callback ) {
    callback();
  } else {
    console.log('Connection to device: ' + req.host + req.originalUrl);

    var options = {
      hostname: req.host,
      port: bluetoothServerPort,
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
