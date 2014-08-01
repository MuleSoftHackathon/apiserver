'use strict';
var rccar = require('./rccar/rccar');
var pi = require('./pi/pi');
var sphero = require('./sphero/sphero');
exports.sphero = sphero;

exports.rootHandler = function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Welcome to Hackathon!');
};

exports.rccarHandler = function(req, res) {
	rccar.handle(req, res);
};

exports.piHandler = function(req, res) {
	pi.handle(req, res);
};

exports.spheroHandler = function(req, res) {
  sphero.action(req, res);
};