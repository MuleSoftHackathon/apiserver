'use strict';
var express    = require('express');
var http       = require('http');
var bodyParser = require('body-parser');
var handlers   = require('./handlers');

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

router.use('/deviceserver/', handlers.checkAccessKey);
router.use('/pi/:accessKey', handlers.checkAccessKey);
router.use('/rccar/:accessKey', handlers.checkAccessKey);
router.use('/sphero/:accessKey', handlers.checkAccessKey);

router.route('/').get(handlers.rootHandler);
router.route('/deviceserver/register')
  .post(handlers.registerServer);
router.route('/deviceserver/pi')
  .get(handlers.getPiServer);
router.route('/deviceserver/bluetooth')
  .get(handlers.getBluetoothServer);
router.route('/pi/:accessKey/:action').all(handlers.piHandler);
router.route('/rccar/:accessKey/:action').all(handlers.rccarHandler);
router.route('/sphero/:accessKey/:action').all(handlers.spheroHandler);


app.all('*', router);
