'use strict';
var express = require('express');
var app = express();
var router = require('./router');


var server = app.listen(8124,  function() {
    console.log('Listening on port %d', server.address().port);
});

app.get('/', router.rootHandler);
app.get('/register', router.register);

app.get('/rccar/:id/:action', router.rccarHandler);
app.get('/pi/:id/:action', router.piHandler);
app.get('/sphero/:id/:action', router.spheroHandler);