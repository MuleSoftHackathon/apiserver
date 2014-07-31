'use strict';
var express = require('express');
var app = express();
var router = require('./router');


var server = app.listen(8124);

router.sphero.connect();
app.get('/', router.rootHandler);
app.get('/rccar/:id/:action', router.rccarHandler);
app.get('/pi/:id/:action', router.piHandler);
app.get('/sphero/:id/:action', router.spheroHandler);
