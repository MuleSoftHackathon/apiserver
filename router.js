'use strict';
var pi = require('./pi/pi');
var fs = require('fs');

exports.rootHandler = function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Welcome to Hackathon!');
};

var bluetoothServerPort = 8352;
var bluetoothServers = {};
var accessKeys;
var deviceIds;
exports.register = function(req, res) {
	var key = req.query.key;
	var host = req.host;
	var team = accessKeys[key];
	if (team == null) {
		res.json({message: 'invalid key!'});
	} else {
		bluetoothServers[team] = host;
	}
}

exports.piHandler = function(req, res) {
	_handle(req, res, pi.handle);
};


exports.spheroHandler = function(req, res) {
	_handle(req, res,_redirectBluetooth);
};

exports.rccarHandler = function(req, res) {
	_handle(req, res, _redirectBluetooth);
};

function _handle(req, res, next) {
	var id = req.params.id;
	var team = deviceIds[id];
	if (team == null) {
		res.json({message: "no such id"});
	} else {
		next(req, res);
	}
}

function _redirectBluetooth(req, res) {
	var id = req.params.id;
	var team = deviceIds[id];
	var host = bluetoothServers[team];
	if(host == null) {
		res.json({message: "team server not registered!"});
	} else {
		// redirect
	}

}

fs.readFile('key.config', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var obj = JSON.parse(data);
  accessKeys = obj.accessKeys;
  deviceIds = obj.deviceIds;
});
