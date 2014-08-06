'use strict';
var express = require('express'),
    http = require('http'),
    app = express(),
    router = require('./router'),
    server;


server = app.listen(8080,  function() {
    console.log('Listening on port %d', server.address().port);
});


app.get('/', router.rootHandler);
app.get('/register', router.register);

app.get('/rccar/:id/:action', router.rccarHandler);
app.get('/pi/:id/:action', router.piHandler);
app.get('/sphero/:id/:action', router.spheroHandler);
