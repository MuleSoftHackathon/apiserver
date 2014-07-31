var Sphero = require('./sphero.js');
Sphero.connect();

setTimeout(function(){
  var request = {
    id: 1,
    action: 'move?=direction=0'
  };
  Sphero.action(request);
  console.log('MOVE');
}, 10000);