var express = require('express');
var app = express();
var path = require('path');
var rpio =  require('rpio');
var schedule = require('node-schedule');
var request = require('request');

//web server
app.use(express.static(__dirname + '/'));

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
  console.log('server is listening on port 3333');
});

//GPIO control

rpio.open(12,  rpio.OUTPUT,  rpio.LOW);

//Daily schedule - get weather report

var rule1 = new schedule.RecurrenceRule();
rule1.second = 10;

var j1 = schedule.scheduleJob(rule1, function(){
  rpio.write(12,  rpio.HIGH);
});

var rule2 = new schedule.RecurrenceRule();
rule2.second = 20;

var j2 = schedule.scheduleJob(rule2, function(){
  rpio.write(12,  rpio.LOW);
});

//get the weather data

function getWeather(param1, callback){
  var weather = callback();
  JSON.parse(weather);
}

getWeather("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", function(){
  request('https://api.openweathermap.org/data/2.5/forecast?id=2634838&APPID=b7b73e00a4e940f2319cad207b3682f3', function(err, res, body) {
    if (err) {
      throw err;
    }
    console.log(body);
  });
});

