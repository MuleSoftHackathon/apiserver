'use strict';
var express    = require('express');
var http       = require('http');
var handlers   = require('./handlers');
var bodyParser = require('body-parser');

var app    = express();
var router = express.Router();
var server = app.listen(8080,  function() {
  console.log('Listening on port %d', server.address().port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.use(function(req, res, next) {
  // log all incoming requests
  console.log('-- %s %s from %s', req.method, req.path, req.ip);
  next();
});

router.route('/').get(handlers.rootHandler);
router.route('/remoteDevice')
.get(handlers.getDevice)
.post(handlers.registerDevice)
.delete(handlers.removeDevice);

router.route('/pi/:id/:action').all(handlers.piHandler);
router.route('/rccar/:id/:action').all(handlers.rccarHandler);
router.route('/sphero/:id/:action').all(handlers.spheroHandler);

app.all('*', router);
