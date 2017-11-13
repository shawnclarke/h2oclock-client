var express = require('express');
var app = express();
var path = require('path');
//var rpio =  require('rpio');
//var schedule = require('node-schedule');
var request = require('request');
var openWeatherMaps = 'https://api.openweathermap.org/data/2.5/forecast?id=2634838&APPID=b7b73e00a4e940f2319cad207b3682f3';
var darkSkys = 'https://api.darksky.net/forecast/5ca5b0037be5109d0159838b86bd83e1/51.588124,-0.037381?exclude=currently,minutely,hourly,alerts,flags&units=uk2'
var weatherObj = {};
var typeOfDay = "";

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

//rpio.open(12,  rpio.OUTPUT,  rpio.LOW);

//Daily schedule - get weather report

/* var rule1 = new schedule.RecurrenceRule();
rule1.second = 10;

var j1 = schedule.scheduleJob(rule1, function(){
  rpio.write(12,  rpio.HIGH);
});

var rule2 = new schedule.RecurrenceRule();
rule2.second = 20;

var j2 = schedule.scheduleJob(rule2, function(){
  rpio.write(12,  rpio.LOW);
}); */

//get the weather data



function getApiDataCallback(err, res, body){  
      if (err) {
        throw err;
      }
      var jsonObj = JSON.parse(body);
      setWeatherObj(jsonObj);
    }
  
  
    function getApiData(url, callback){
      request(url, callback);
    }


    function setWeatherObj(body){
    weatherObj.summary = body.daily.data[0].summary;
    weatherObj.icon = body.daily.data[0].icon;
    weatherObj.temperatureHigh = body.daily.data[0].temperatureHigh;
    weatherObj.precipIntensity = body.daily.data[0].precipIntensity;
    setTypeOfDay();
    }

    function setTypeOfDay(){
      if((weatherObj.temperatureHigh >= 30 && weatherObj.precipIntensity < 2) || (weatherObj.temperatureHigh >= 25 && weatherObj.precipIntensity < 1)){
        typeOfDay = "high";
      } else if (weatherObj.temperatureHigh < 18 && weatherObj.precipIntensity < 1) {
        typeOfDay = "low";
      } else {
        typeOfDay = "med";
      }
      setupSchedulers(typeOfDay);
    }

    function setupSchedulers(typeOfDay) {
      console.log(typeOfDay);
      console.log(weatherObj.temperatureHigh);
      console.log(weatherObj.precipIntensity);
    }
  
    getApiData(darkSkys, getApiDataCallback);
