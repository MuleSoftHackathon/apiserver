'use strict';

var http = require('http');
/*
 rccar = require('./rccar/rccar'),
 pi = require('./pi/pi');
 */

exports.rootHandler = function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Welcome to Hackathon!');
};



exports.spheroHandler = function(req, res) {

    console.log('Connection to sphero: ' + req.host + req.originalUrl);

    var options = {
            hostname: req.host,
            port: 8352,
            path: req.originalUrl,
            method: 'GET'
        },
        data = '',
        requestToSphero = http.request(options, function(responseFromSphero) {

            responseFromSphero.setEncoding('utf8');

            responseFromSphero.on('data', function(chunk){
                data += chunk;
            });

            responseFromSphero.on('end', function () {

                res.status(responseFromSphero.statusCode).send(data);
            });
        });

    requestToSphero.on('error', function(e) {
        res.status(404).end();
        console.log('problem with request: ' + e.message);
    });

    requestToSphero.end();
};



/*exports.rccarHandler = function(req, res) {
	rccar.handle(req, res);
};

exports.piHandler = function(req, res) {
	pi.handle(req, res);
};*/
