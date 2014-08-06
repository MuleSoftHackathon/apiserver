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
	if (team == null) {
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

    _handle(req, res, _redirectBluetooth, function() {

        console.log('Connection to sphero: ' + req.host + req.originalUrl);

        var options = {
                hostname: req.host,
                port: bluetoothServerPort,
                path: req.originalUrl,
                method: 'GET'
            },
            data = '',
            requestToSphero = http.request(options, function (responseFromSphero) {

                responseFromSphero.setEncoding('utf8');

                responseFromSphero.on('data', function (chunk) {
                    data += chunk;
                });

                responseFromSphero.on('end', function () {

                    res.status(responseFromSphero.statusCode).send(data);
                });
            });

        requestToSphero.on('error', function (e) {
            res.status(404).end();
            console.log('problem with request: ' + e.message);
        });

        requestToSphero.end();
    });
};

exports.rccarHandler = function(req, res) {
	_handle(req, res, _redirectBluetooth);
};

function _handle(req, res, next, callback) {
	var id = req.params.id;
	var team = deviceIds[id];
	if ( !team ) {
		res.json({message: 'no such id'});
	} else {
		next(req, res, callback);
	}
}

function _redirectBluetooth(req, res, callback) {
	var id = req.params.id;
	var team = deviceIds[id];
	var host = bluetoothServers[team];
	if( !host ) {
		res.json({message: 'team server not registered!'});
	} else if ( callback ) {
        callback();
    } else {
		var url = 'http://' + host + ':' + bluetoothServerPort + req.originalUrl;
		res.redirect(url);
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
