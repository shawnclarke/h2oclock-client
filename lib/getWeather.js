//var request = require('request');
import request from 'request';
var weatherObj = {};
var typeOfDay = "";

function getApiDataCallback(err, res, body) {
    if (err) {
      throw err;
    }
    var jsonObj = JSON.parse(body);
    setWeatherObj(jsonObj);
  }
  
  
  function getApiData(url, callback) {
    request(url, callback);
  }
  
  
  function setWeatherObj(body) {
    weatherObj.summary = body.daily.data[0].summary;
    weatherObj.icon = body.daily.data[0].icon;
    weatherObj.temperatureHigh = body.daily.data[0].temperatureHigh;
    weatherObj.precipIntensity = body.daily.data[0].precipIntensity;
    setTypeOfDay();
  }
  
  function setTypeOfDay() {
    if ((weatherObj.temperatureHigh >= 30 && weatherObj.precipIntensity < 2) || (weatherObj.temperatureHigh >= 25 && weatherObj.precipIntensity < 1)) {
      typeOfDay = "high";
    } else if (weatherObj.temperatureHigh < 18 && weatherObj.precipIntensity > 1) {
      typeOfDay = "low";
    } else {
      typeOfDay = "med";
    }
    console.log(typeOfDay);
    weatherObj.typeOfDay = typeOfDay;
    console.log(weatherObj.temperatureHigh);
    console.log(weatherObj.precipIntensity);
  }

  export {getApiData, getApiDataCallback };