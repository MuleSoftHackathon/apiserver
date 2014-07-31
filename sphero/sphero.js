var roundRobot = require('node-sphero');
var sphero = new roundRobot.Sphero();
var spheros = [];
var exports = {};

sphero.on("connected", function(ball){

  console.log('Sphero Connected');
  spheros.push(ball);
});

function color() {
  var r = Math.random()*255;
  var g = Math.random()*255;
  var b = Math.random()*255;
  return [r, g, b];
};

exports.connect = function() {
  sphero.connect();
};

exports.action = function(request, response) {
  var id = request.params.id,
      action = request.params.action,
      ball = spheros[id-1],
      query = request.query,
      direction = query.direction,
      rgb;

  console.log(action);
  if( !ball ) {
    return;
  };

  if( action ) {
    switch (action) {
      case 'q':
        ball.close();
        break;
      case 'c':
        rgb = color();
        ball.setRGBLED(rgb[0], rgb[1], rgb[2], false);
      case 'move':
        if( direction ) {
          ball.roll(direction, 0.6);
        }
      default:
        break;
    }
  }
};

module.exports = exports;