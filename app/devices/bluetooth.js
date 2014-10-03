'use strict';
var http = require('http');
var request = require('request');

exports.handle = function(req, res, remote) {
	var id = req.params.id;
	
	if (!remote) {
		res.status(400).json({
			message : 'team server not registered!'
		});
	} else {
		console.log('Connection to device: ' + remote.host + req.originalUrl);

		var options = {
			hostname : remote.host,
			port : remote.port,
			path : req.originalUrl,
			method : 'GET'
		}, data = '', requestToDevice = http.request(options, function(
				responseFromDevice) {
			responseFromDevice.setEncoding('utf8');
			responseFromDevice.on('data', function(chunk) {
				data += chunk;
			});

			responseFromDevice.on('end', function() {
				res.status(responseFromDevice.statusCode).send(data);
			});
		});

		requestToDevice.on('error', function(e) {
			res.status(400).end();
			console.log('problem with request: ' + e.message);
		});

		requestToDevice.end();
	}
}