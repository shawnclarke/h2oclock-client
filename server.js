const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var Gpio = require('pigpio').Gpio;
var led = new Gpio(17, {mode: Gpio.OUTPUT});

led.digitalWrite(1);
