var express = require('express');
var app = express();
var path = require('path');

var rpio = require('rpio');

/* var Gpio = require('onoff').Gpio,
led = new Gpio(17, 'out');

var name = "shawn"; */

/* function turnOn() {
  console.log("Hello");
  led.writeSync(1);
}

function turnOff() {
  led.writeSync(0);
} */

//turnOff();


/* app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
}); */

app.use(express.static(__dirname + '/'));


 
/* var iv = setInterval(function(){
	led.writeSync(led.readSync() === 0 ? 1 : 0)
}, 500);
 
// Stop blinking the LED and turn it off after 5 seconds.
setTimeout(function() {
    clearInterval(iv); // Stop blinking
    led.writeSync(0);  // Turn LED off.
    led.unexport();    // Unexport GPIO and free resources
}, 5000); */

/*
 * Set the initial state to low.  The state is set prior to the pin becoming
 * active, so is safe for devices which require a stable setup.
 */
rpio.open(12, rpio.OUTPUT, rpio.LOW);
 
/*
 * The sleep functions block, but rarely in these simple programs does one care
 * about that.  Use a setInterval()/setTimeout() loop instead if it matters.
 */
for (var i = 0; i < 5; i++) {
        /* On for 1 second */
        rpio.write(12, rpio.HIGH);
        rpio.sleep(1);
 
        /* Off for half a second (500ms) */
        rpio.write(12, rpio.LOW);
        rpio.msleep(500);
}


app.get('/on', function(req, res){
          rpio.write(12, rpio.HIGH);
});

app.listen(3333, function(){
  console.log('server is listening');
});