const express = require('express');
const app = express();
const path = require('path');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var Gpio = require('onoff').Gpio,
    led = new Gpio(17, 'out');
 
/* var iv = setInterval(function(){
	led.writeSync(led.readSync() === 0 ? 1 : 0)
}, 500);
 
// Stop blinking the LED and turn it off after 5 seconds.
setTimeout(function() {
    clearInterval(iv); // Stop blinking
    led.writeSync(0);  // Turn LED off.
    led.unexport();    // Unexport GPIO and free resources
}, 5000); */

function off() {
  led.writeSync(0);
}

function on() {
  led.writeSync(1);
}

document.getElementById('on').onclick = function() {
  led.writeSync(1);
};