'use strict';
var express    = require('express');
var http       = require('http');
var router     = require('./router');
var bodyParser = require('body-parser');

var app    = express();
var server = app.listen(8080,  function() {
  console.log('Listening on port %d', server.address().port);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', router.rootHandler);
app.route('/register').post(router.register);

app.all('/rccar/:id/:action', router.rccarHandler);
app.all('/pi/:id/:action', router.piHandler);
app.all('/sphero/:id/:action', router.spheroHandler);
