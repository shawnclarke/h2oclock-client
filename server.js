const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var Gpio = require('pigpio').Gpio,
led = new Gpio(17, {mode: Gpio.OUTPUT}),
dutyCycle = 0;

setInterval(function () {
led.pwmWrite(dutyCycle);

dutyCycle += 5;
if (dutyCycle > 255) {
  dutyCycle = 0;
}
}, 20);