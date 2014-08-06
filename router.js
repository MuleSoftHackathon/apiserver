'use strict';

var http = require('http');
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
	if ( !team ) {
		res.json({message: 'invalid key!'});
	} else {
		bluetoothServers[team] = host;
		res.json({message: 'registered!'})
	}
}

exports.piHandler = function(req, res) {
	_handle(req, res, pi.handle);
};


exports.spheroHandler = function(req, res) {

    _handle(req, res, _redirectBluetooth);
};

exports.rccarHandler = function(req, res) {
	_handle(req, res, _redirectBluetooth);
};

function _handle(req, res, next) {
	var id = req.params.id;
	var team = deviceIds[id];
	if ( !team ) {
		res.json({message: 'no such id'});
	} else {
		next(req, res);
	}
}

function _redirectBluetooth(req, res) {
	var id = req.params.id;
	var team = deviceIds[id];
	var host = bluetoothServers[team];
	if( !host ) {
		res.json({message: 'team server not registered!'});
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
            requestTodevice = http.request(options, function (responseFromdevice) {

                responseFromdevice.setEncoding('utf8');

                responseFromdevice.on('data', function (chunk) {
                    data += chunk;
                });

                responseFromdevice.on('end', function () {

                    res.status(responseFromdevice.statusCode).send(data);
                });
            });

        requestTodevice.on('error', function (e) {
            res.status(404).end();
            console.log('problem with request: ' + e.message);
        });

        requestTodevice.end();
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
