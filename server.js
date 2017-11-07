var express = require('express');
var app = express();
var path = require('path');
var  rpio  =  require('rpio');

app.use(express.static(__dirname + '/'));
rpio.open(12,  rpio.OUTPUT,  rpio.LOW);

app.get('/on', function (req, res) {
  console.log('about to write to GPIO');
  rpio.write(12,  rpio.HIGH);
  console.log('written to GPIO');
  return res.json('hi');
});

app.get('/off', function (req, res) {
  console.log('about to write to GPIO');
  rpio.write(12,  rpio.LOW);
  console.log('written to GPIO');
});

app.listen(3333, function () {
  console.log('server is listening');
});