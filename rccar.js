'use strict';
exports.handle = function (req, res) {
  var id = req.params.id;
  var action = req.params.action;

  var controller = carController[action];

  if (controller == null) {
    res.json({message: "no such action!"});
  } else {
    controller(req, res);
  }
};


var TIMEOUT = 5000;

//"/dev/tty.HC-06-DevB"
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/tty.usbmodem1411", {
  baudrate: 9600
});

var carController = {
  open: function(res){
    serialPort.open();
    res.send('opend');
  },
  close: function(res){
    serialPort.close();
    res.send('closed');
  },
  forward :function(res){
    serialPort.write('F');
    readData(res);
  },
  backward : function(res){
    serialPort.write('B');
    readData(res);
  },
  stop : function(res){
    serialPort.write('S');
    readData(res);
  }
};


function readData(res) {
  var ret = {};
  var message;
  serialPort.on('data', function(data) {
    message += data;
    var idx = data.indexOf('\n');
    if (idx != -1) {
      ret.status = 'Success';
      ret.message = message.substring(0, idx);
      message = data.substring(idx);
      res.json(ret);
    }
  });
}
