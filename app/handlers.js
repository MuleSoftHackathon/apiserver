'use strict';
var http = require('http');
var fs = require('fs');
var pi = require('./devices/pi');
var bluetooth = require('./devices/bluetooth');

/**
 * routing
 */

exports.rootHandler = function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	res.end('Welcome to Hackathon! -- Central Api Server');
};

exports.getPiServer = function(req, res) {
	showDeviceServer(req, res, 'pi');
}

exports.getBluetoothServer = function(req, res) {
	showDeviceServer(req, res, 'bluetooth');
}

exports.registerServer = function(req, res) {
	register(req, res);
}

exports.piHandler = function(req, res) {
	var deviceServer = piServers[req.params.accessKey];
	pi.handle(req, res, deviceServer);
};

exports.spheroHandler = function(req, res) {
	var deviceServer = bluetoothServers[req.params.accessKey];
	bluetooth.handle(req, res);
};

exports.rccarHandler = function(req, res) {
	var deviceServer = bluetoothServers[req.params.accessKey];
	bluetooth.handle(req, res);
};

/**
 * Register Pi server or Bluetooth server
 */

var accessKeys = {};
var piServers = {};
var bluetoothServers = {};

exports.checkAccessKey = function(req, res, next) {
	var accessKey = req.params.accessKey || req.query.accessKey
			|| req.body.accessKey;
	var team = accessKeys[accessKey];
	if (team == null) {
		res.status(400).json({
			message : 'Invalid access key ' + accessKey
		});
		console.log('invalid access key {' + accessKey + '}!');
		return;
	}
	console.log('valid access key! -- team ' + team);
	next();
}

function register(req, res) {
	var deviceServer = {
		type : req.body.type,
		accessKey : req.body.accessKey,
		host : req.body.ip || req.ip,
		port : req.body.port
	};

	var team = accessKeys[deviceServer.accessKey];
	var oldServer = null;
	if (deviceServer.type === 'bluetooth') {
		oldServer = bluetoothServers[team];
		bluetoothServers[team] = deviceServer;
	} else if (deviceServer.type === 'pi') {
		olderServer = piServers[team];
		piServers[team] = deviceServer;
	}

	var retMessage = oldServer == null ? 'Registered' : 'Updated';
	console.log('---------- ' + deviceServer.type + ' server: '
			+ deviceServer.id + ' ' + retMessage + ' ----------');
	console.log('old Server %j', oldServer);
	console.log('new Server %j', deviceServer);
	var resMessage = deviceServer.type + ' Device server registered at '
			+ deviceServer.ip + ':' + deviceServer.port + '!';
	res.json({
		message : resMessage
	});
}

function showDeviceServer(req, res, type) {
	var accessKey = req.query.accessKey;
	var team = accessKeys[accessKey];
	var deviceServer;

	if (type == 'bluetooth') {
		deviceServer = bluetoothServers[team];
	} else if (type == 'pi') {
		deviceServer = piServers[team];
	}
	if (deviceServer == null) {
		res.json({
			message : 'no device server registered'
		})
		return;
	}

	res.json({
		id : deviceServer.id,
		type : deviceServer.type,
		host : deviceServer.host,
		port : deviceServer.port
	});
}

/**
 * Read access keys on start up
 */

fs.readFile('key.config', 'utf8', function(err, data) {
	if (err) {
		return console.log(err);
	}
	var obj = JSON.parse(data);
	accessKeys = obj.accessKeys;
});
