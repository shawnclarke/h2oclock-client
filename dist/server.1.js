'use strict';

var _getWeather = require('./getWeather');

var express = require('express');
var app = express();
var path = require('path');
//var rpio =  require('rpio');
var schedule = require('node-schedule');
var request = require('request');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var openWeatherMaps = 'https://api.openweathermap.org/data/2.5/forecast?id=2634838&APPID=b7b73e00a4e940f2319cad207b3682f3';
var darkSkys = 'https://api.darksky.net/forecast/5ca5b0037be5109d0159838b86bd83e1/51.588124,-0.037381?exclude=currently,minutely,hourly,alerts,flags&units=uk2';

//DB server
mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/client_config', {
  useMongoClient: true
});

promise.then(function (db) {
  console.log('DATABASE CONNECTED!!');
}).catch(function (err) {
  console.log('CONNECTION ERROR', err);
});

//web server
app.use(express.static('public'));

app.get('/on', function (req, res) {
  console.log('about to write to GPIO');
  rpio.write(12, rpio.HIGH);
  console.log('written to GPIO');
  return res.json('hi');
});

app.get('/off', function (req, res) {
  console.log('about to write off to GPIO');
  rpio.write(12, rpio.LOW);
  console.log('written off to GPIO');
});

//DB api
app.get('/config', function (request, response) {
  var config = [{}, {}];
  return response.json(cars);
});

//Type of day api
app.get('/typeofday', function (request, response) {
  return response.json(weatherObj);
});

app.listen(3333, function () {
  console.log('server is listening on port 3333');
});

//GPIO control

//rpio.open(12,  rpio.OUTPUT,  rpio.LOW);
//rpio.write(12,  rpio.HIGH);
//rpio.write(12,  rpio.LOW);

//Daily schedule - get weather report

/* var writeWeather = new schedule.RecurrenceRule();
writeWeather.second = 20;

var j3 = schedule.scheduleJob(writeWeather, function(){
  console.log(typeOfDay);
}); */

//get the weather data


(0, _getWeather.getApiData)(darkSkys, _getWeather.getApiDataCallback);